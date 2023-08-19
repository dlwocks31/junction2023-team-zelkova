import ProgressBar from "@ramonak/react-progress-bar";
import { Button, DoubleChevronUpIcon, IconButton, Modal } from "loplat-ui";
import { NextSeo } from "next-seo";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import Marker, {
  generateFootprintMarkerIcon,
  generateRestaurantMarkerIcon,
} from "~/components/map/Marker";
import { Restaurant } from "~/server/mock-db";
import { Coordinates } from "~/types/map";
import { api } from "~/utils/api";
import {
  calculateAngle,
  calculateDistanceBetweenCoordinates,
} from "~/utils/math";
import { ChatComponent, Message } from "../components/Chat";
import Map from "../components/map/Map";

export default function MapPage() {
  const [map, setMap] = useState<null | naver.maps.Map>(null);
  const { data: currentLocation } = useSWR<Coordinates>("currentLocation");
  const { data: currentRestaurant } = useSWR<Restaurant>("currentRestaurant");
  const [paths, setPaths] = useState<Coordinates[]>([]);

  const sendMessageMutation = api.getPickupWayMessage.useMutation();

  const getNextMessage = async ({
    allMessages,
  }: {
    allMessages: Message[];
  }) => {
    const { message } = await sendMessageMutation.mutateAsync(allMessages);
    return {
      speaker: "bot" as const,
      content: message,
    };
  };

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
  const [status, setStatus] = useState(0); // 1: on way, 2: we're here, 3: waiting for pickup, 4: chatting
  const [floatOpen, setFloatOpen] = useState(false);
  useEffect(() => {
    if (status === 0 && completed > 20) {
      navigator.vibrate(200);
      setStatus(1);
      setFloatOpen(true);
    } else if (status === 1 && completed === 100) {
      navigator.vibrate(200);
      setStatus(2);
      setFloatOpen(true);
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
  const [modalOpen, setModalOpen] = useState(false);
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
            baseBgColor="#F1F1F1"
            isLabelVisible={false}
          />
          <div className="relative mt-1 flex justify-between">
            <span className="text-xs font-bold" style={{ color: "#2E6AC8" }}>
              Order Placed
            </span>
            <span className="text-xs" style={{ color: "#000000" }}>
              5:26 PM.
            </span>
            <div
              className="absolute right-4 flex flex-col items-center text-xs"
              style={{ color: "#000000", top: -58 }}
            >
              <span className="font-bold">My ETA</span>
              <span>5:23 PM.</span>
              <div
                className="mt-1 h-4 w-4 rounded-full"
                style={{ background: "#D9D9D9" }}
              />
            </div>
          </div>
          <Modal
            isOpen={modalOpen}
            onClose={() => {
              setModalOpen(false);
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
        <div
          className="floatChat"
          style={{
            transform: `translateY(${floatOpen ? "0%" : "-100%"})`,
          }}
        >
          <hr className="mb-4 mt-2 w-full" />
          {status === 1 && (
            <>
              <div className={`speech bot`}>
                Nice work 😊 It's 26 degrees today. Seems a little hot, doesn't
                it?
              </div>
              <IconButton
                onClick={() => {
                  setFloatOpen(false);
                }}
                variant="ghost2"
                borderless
              >
                <DoubleChevronUpIcon size={16} suffixForId="up" />
              </IconButton>
            </>
          )}
          {status === 2 && (
            <>
              <div className={`speech bot`}>
                Wow, great job 😚 Did you finish the pickup?
              </div>
              <div className="mb-4 mr-8 mt-4 flex w-full justify-end gap-4">
                <Button
                  size="sm"
                  onClick={() => {
                    setModalOpen(true);
                  }}
                >
                  Yes
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    setStatus(3);
                  }}
                >
                  Not yet
                </Button>
              </div>
            </>
          )}
          {status === 3 && (
            <>
              <div className={`speech bot`}>
                I see! Then, why don't you talk to me some more?
              </div>
              <div className="mb-4 mr-8 mt-4 flex w-full justify-end gap-4">
                <Button
                  size="sm"
                  onClick={() => {
                    setStatus(4);
                  }}
                >
                  Good
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    setFloatOpen(false);
                    setTimeout(() => {
                      setModalOpen(true);
                    }, 3000);
                  }}
                >
                  It's okay
                </Button>
              </div>
            </>
          )}
          {status === 4 && (
            <div style={{ width: "100%", height: "calc(100vh - 140px)" }}>
              <ChatComponent
                initialMessages={[
                  {
                    speaker: "bot",
                    content:
                      "How was the pick up? This is your second pick up with me already🤭",
                  },
                ]}
                getNextMessage={getNextMessage}
                actionButtons={[
                  {
                    text: "Pick up complete!",
                    callback: () => {
                      return;
                    },
                  },
                  {
                    text: "I don't want to talk anymore.",
                    callback: () => {
                      return;
                    },
                  },
                ]}
              />
            </div>
          )}
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
          position: relative;
          z-index: 2;
          padding: 18px;
          width: 100%;
          height: 120px;
          background: white;
        }
        .statusWords {
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

        .floatChat {
          position: absolute;
          top: 120px; // TODO: change value
          left: 0;
          width: 100%;
          background: white;
          z-index: 1;
          transition: transform 0.5s;
          display: flex;
          flex-direction: column;
          align-items: center;
          box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
          border-radius: 0px 0px 15px 15px;

          .speech {
            position: relative;
            background-color: #dde9fc;
            border-radius: 18px;
            padding: 12px 12px;
            width: fit-content;
            max-width: 340px;
            border: none;
            left: 0;
            margin: 0;
            text-align: left;
          }
          .speech::before {
            content: "";
            position: absolute;
            bottom: 10px;
            left: -20px;
            transform: translateX(0);
            border-style: solid;
            border-width: 11px;
            border-color: transparent #dde9fc transparent transparent;
          }
        }
      `}</style>
    </>
  );
}
