import dayjs from "dayjs";
import { CircleLoading, IconButton, NearMeIcon } from "loplat-ui";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { mutate } from "swr";
import { type Restaurant } from "~/server/mock-db";

export interface Message {
  speaker: "bot" | "human";
  content: string;
  restaurants?: Restaurant[];
}
function RestaurantSelectComponent({
  restaurant,
  index,
}: {
  restaurant: Restaurant;
  index: number;
}) {
  return (
    <div className="flex gap-1">
      <div>{index}.</div>
      <div className="flex flex-col gap-1">
        <div className="flex gap-1">
          <div className="text">
            {restaurant.name} | {restaurant.distance}m
          </div>
        </div>
        <div className="flex gap-1">
          <BlueCircleComponent text={`${restaurant.picked} picked`} />
          {restaurant.crowdDegree < 3 && (
            <BlueCircleComponent text="Least crowded now!" />
          )}
        </div>
      </div>
    </div>
  );
}
function BlueCircleComponent({ text }: { text: string }) {
  return (
    <div className="rounded-full bg-[#427AD2] px-2 py-1 text-sm text-white">
      {text}
    </div>
  );
}

export function ChatComponent({
  initialMessages,
  getNextMessage,
}: {
  initialMessages: Message[];
  getNextMessage: (message: string) => Promise<Message>;
}) {
  function scrollToBottom() {
    setTimeout(() => {
      const element = document.getElementsByClassName("chatting")[0];
      if (element) {
        element.scrollTop = element.scrollHeight;
      }
    }, 0);
  }

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const sendMessage = () => {
    if (!currentMessage.trim()) return;
    setMessages((state) => [
      ...state,
      { speaker: "human", content: currentMessage },
    ]);
    setCurrentMessage("");
    scrollToBottom();
    setIsLoading(true);
    getNextMessage(currentMessage).then((message) => {
      setMessages((state) => [...state, message]);
      scrollToBottom();
      setIsLoading(false);
    });
  };
  const router = useRouter();
  const showIntro = messages.length === 1;
  return (
    <>
      {showIntro ? (
        <div className="intro">
          <div className="rabbit">
            <div className="speech">{messages[0]?.content}</div>
            <img
              src="/gif/walking.gif"
              alt=""
              style={{ width: "50%", margin: "auto" }}
            />
          </div>
        </div>
      ) : (
        <div className="chatting">
          <p className="time">{dayjs().format("YYYY.MM.DD HH:mm a")}</p>
          {messages.map((message, index) => (
            <div className={`speech ${message.speaker}`} key={index}>
              {message.content}
              {message.restaurants && (
                <div className="menus">
                  {message.restaurants.map((restaurant, i) => (
                    <React.Fragment key={i}>
                      <div
                        onClick={() => {
                          router.push(`/order`);
                          mutate("currentRestaurant", restaurant);
                        }}
                      >
                        <RestaurantSelectComponent
                          restaurant={restaurant}
                          index={i + 1}
                        />
                      </div>

                      {i !== message.restaurants!.length - 1 && (
                        <hr className="my-2 border-gray-400" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <form
        className="sendMessage"
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
      >
        <input
          className="input"
          value={currentMessage}
          onChange={(e) => {
            console.log(typeof e.target.value);
            setCurrentMessage(e.target.value);
          }}
        />
        <IconButton variant="ghost2" borderless>
          {isLoading ? (
            <CircleLoading size={30} />
          ) : (
            <NearMeIcon fill="#000000" size={20} suffixForId="nearMe" />
          )}
        </IconButton>
      </form>
      <style jsx>
        {`
          .time {
            padding: 24px 0;
            text-align: center;
            font-size: 14px;
            color: #3c3c43;
          }
          .intro {
            position: relative;
            padding-top: 200px;
            width: 100%;

            .rabbit {
              width: 100%;
            }
          }
          .chatting {
            position: relative;
            padding-bottom: 64px;
            height: 100%;
            overflow: scroll;

            .menus {
              background: #fdfdfd;
              border-radius: 10px;
              padding: 12px 20px;
              margin: 8px 0;
            }
          }
          .speech {
            position: relative;
            background-color: #dde9fc;
            border-radius: 18px;
            padding: 12px 12px;
            margin: 16px auto;
            width: fit-content;
            max-width: 340px;
            text-align: center;
            border: none;

            &.bot {
              left: 16px;
              margin: 0;
              text-align: left;
              &::before {
                bottom: 10px;
                left: -20px;
                transform: translateX(0);
                border-style: solid;
                border-width: 11px;
                border-color: transparent #dde9fc transparent transparent;
              }
            }
            &.human {
              left: -24px;
              margin-right: 0;
              background-color: #2e6ac8;
              text-align: right;
              color: white;
              &::before {
                bottom: 4px;
                left: unset;
                right: -20px;
                transform: translateX(0);
                border-style: solid;
                border-width: 11px;
                border-color: transparent transparent transparent #2e6ac8;
              }
            }
          }
          .speech::before {
            content: "";
            position: absolute;
            bottom: -20px;
            left: 50%;
            transform: translateX(-50%);
            border-style: solid;
            border-width: 11px;
            border-color: #dde9fc transparent transparent transparent;
          }
          .sendMessage {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            padding: 12px 6px 12px 12px;
            display: flex;
            background: #f1f1f1;

            .input {
              width: 100%;
              border-radius: 20px;
              padding: 0 16px;
            }
          }
        `}
      </style>
    </>
  );
}