import { NextSeo } from "next-seo";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import Marker, {
  generateFootprintMarkerIcon,
  generateRestaurantMarkerIcon,
} from "~/components/map/Marker";
import { Coordinates } from "~/types/map";
import { api } from "~/utils/api";
import Map from "../components/map/Map";
import {
  calculateAngle,
  calculateDistanceBetweenCoordinates,
} from "~/utils/math";
import ProgressBar from "@ramonak/react-progress-bar";
import { Restaurant } from "~/server/mock-db";
import { Button, Modal } from "loplat-ui";
import Image from "next/image";
import { useRouter } from "next/router";

export default function MapPage() {
  const [map, setMap] = useState<null | naver.maps.Map>(null);
  const { data: currentLocation } = useSWR<Coordinates>("currentLocation");
  const { data: currentRestaurant } = useSWR<Restaurant>("currentRestaurant");
  const [paths, setPaths] = useState<Coordinates[]>([]);

  useEffect(() => {
    if (currentLocation) {
      setPaths((state) => [...state, currentLocation]);
    }
  }, [currentLocation]);

  const completed: number = useMemo(() => {
    if (!currentRestaurant || !currentLocation || !paths[0]) return 10;
    const totalDistance = calculateDistanceBetweenCoordinates(paths[0], [
      currentRestaurant.latitude,
      currentRestaurant.longitude,
    ]);
    const remainDistance = calculateDistanceBetweenCoordinates(
      currentLocation,
      [currentRestaurant.latitude, currentRestaurant.longitude]
    );
    const newCompleted =
      (1 - Math.min(remainDistance / totalDistance, 1)) * 100;
    return Math.max(10, newCompleted > 90 ? 100 : newCompleted);
  }, [currentLocation, currentRestaurant]);

  /** status **/
  const [status, setStatus] = useState(0); // 1: on way, 2: almost there, 3: waiting for pickup
  useEffect(() => {
    if (status === 0 && completed > 20) {
      navigator.vibrate(200);
      setStatus(1);
    } else if (status === 1 && completed > 90) {
      navigator.vibrate(200);
      setStatus(2);
    } else if (status === 2 && completed === 100) {
      navigator.vibrate(200);
      setStatus(3);
    }
  }, [completed, status]);

  const statusWords = useMemo(() => {
    if (status === 0 || status === 1) {
      return "On the way to pick up!";
    } else if (status === 2) {
      return "We're here!";
    } else if (status === 3) {
      return "Waiting for pick up";
    }
  }, [status]);

  /** modal **/
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <NextSeo title="pickup" description="way to pick up the food" />
      <main
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <div className="panel">
          <h2 className="statusWords">{statusWords}</h2>
          <ProgressBar
            animateOnRender
            completed={completed}
            bgColor="#2E6AC8"
            isLabelVisible={false}
          />
          <Button
            onClick={() => {
              setOpen(true);
            }}
          >
            (test)show modal
          </Button>
          <Modal
            isOpen={open}
            onClose={() => {
              setOpen(false);
            }}
          >
            <div
              className="modalContent"
              onClick={() => {
                router.push("/mypage");
              }}
            >
              <h2 className="title">Congrats!</h2>
              <Image
                src="/image/congrats.png"
                alt=""
                width={220}
                height={254}
              />
              <div className="achievements">
                <div className="row">
                  <Image src="/icon/trophy.png" alt="" width={52} height={48} />
                  <p>The 1st customer who pick up from this store today</p>
                </div>
                <div className="row">
                  <Image
                    src="/icon/footprint.png"
                    alt=""
                    width={42}
                    height={40}
                  />
                  <p>314m with BoB</p>
                </div>
              </div>
            </div>
          </Modal>
        </div>
        <div style={{ width: "100%", height: "100%" }}>
          <Map onLoad={setMap} />
          {map &&
            paths
              .filter(Boolean)
              .map((coor, index) => (
                <Marker
                  key={index}
                  map={map}
                  coordinates={coor}
                  icon={generateFootprintMarkerIcon(
                    index === 0
                      ? 0
                      : calculateAngle(
                          paths[index - 1]?.[0] ?? 0,
                          paths[index - 1]?.[1] ?? 0,
                          paths[index]?.[0] ?? 0,
                          paths[index]?.[1] ?? 0
                        ),
                    index
                  )}
                />
              ))}

          {map && currentLocation && (
            <Marker
              map={map}
              coordinates={currentLocation}
              icon={generateFootprintMarkerIcon(0)}
            />
          )}

          {map && currentRestaurant && (
            <Marker
              map={map}
              coordinates={[
                currentRestaurant.latitude,
                currentRestaurant.longitude,
              ]}
              icon={generateRestaurantMarkerIcon()}
            />
          )}
        </div>
      </main>

      <style jsx>{`
        .panel {
          padding: 18px;
          width: 100%;
          height: 120px;
        }
        h2.status {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 12px;
        }

        .wrapper {
          border: 3px solid blue;
        }

        .modalContent {
          width: 350px;
          max-width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          background: white;
          padding: 40px 16px 20px;

          .title {
            font-size: 22px;
            font-weight: bold;
            margin-bottom: 16px;
          }

          .achievements {
            width: 100%;
            background: #fff9e0;
            padding: 20px 4px;

            .row {
              display: grid;
              grid-template-columns: 42px 1fr;
              align-items: center;
              gap: 16px;
              color: #000000;
            }
          }
        }
      `}</style>
    </>
  );
}
