import { NextSeo } from "next-seo";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import Marker, { generateParentMarkerIcon } from "~/components/map/Marker";
import { Coordinates } from "~/types/map";
import { api } from "~/utils/api";
import Map from "../components/map/Map";
import {
  calculateAngle,
  calculateDistanceBetweenCoordinates,
} from "~/utils/math";
import ProgressBar from "@ramonak/react-progress-bar";
import { Restaurant } from "~/server/mock-db";

export default function MapPage() {
  const restaurant = api.findAllRestaurant.useQuery({});
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
    return Math.max(completed, newCompleted > 90 ? 100 : newCompleted);
  }, [currentLocation, currentRestaurant]);

  return (
    <>
      <NextSeo title="지도" description="TODO" />
      <main
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <div className="panel">
          <h2 className="status">On the way to pick up!</h2>
          <ProgressBar
            animateOnRender
            completed={completed}
            bgColor="#2E6AC8"
            isLabelVisible={false}
          />
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
                  icon={generateParentMarkerIcon(
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

          {/** TODO: make restaurant look different */}
          {map && currentRestaurant && (
            <Marker
              map={map}
              coordinates={[
                currentRestaurant.latitude,
                currentRestaurant.longitude,
              ]}
              onClick={() => {
                alert(currentRestaurant.name);
              }}
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
      `}</style>
    </>
  );
}
