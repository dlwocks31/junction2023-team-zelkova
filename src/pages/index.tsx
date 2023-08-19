import dayjs from "dayjs";
import { CircleLoading, IconButton, NearMeIcon } from "loplat-ui";
import { NextSeo } from "next-seo";
import React, { useState } from "react";
import { api } from "~/utils/api";
import { Restaurant } from "../server/mock-db";

function scrollToBottom() {
  setTimeout(() => {
    const element = document.getElementsByClassName("chatting")[0];
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  }, 0);
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

export default function Home() {
  const restaurants = api.findAllRestaurant.useQuery({});
  const [messages, setMessages] = useState<
    {
      speaker: "bot" | "human";
      content: string;
      restaurants?: Restaurant[];
    }[]
  >([
    {
      speaker: "bot",
      content: "Do you want something to eat now? Let's go get it together 😋",
    },
  ]);

  const sendMessageMutation = api.getRestaurantSuggestion.useMutation({
    onSuccess: (data) => {
      if (data.showSuggestion) {
        const { message, suggestion } = data;
        if (!message || !suggestion)
          throw new Error("message or suggestions is null");

        setMessages((state) => {
          const r = suggestion
            .map((s) => restaurants.data?.find((r) => r.name === s.name))
            .filter((r) => r) as Restaurant[];

          return [
            ...state,
            {
              speaker: "bot",
              content: message,
              restaurants: r,
            },
          ];
        });
      } else {
        const message = data.message;
        if (!message) throw new Error("message is null");
        setMessages((state) => [
          ...state,
          {
            speaker: "bot",
            content: message,
          },
        ]);
      }
      scrollToBottom();
    },
  });
  const [currentMessage, setCurrentMessage] = useState("");
  const sendMessage = () => {
    if (!currentMessage.trim()) return;
    setMessages((state) => [
      ...state,
      { speaker: "human", content: currentMessage },
    ]);
    setCurrentMessage("");
    scrollToBottom();

    sendMessageMutation.mutate({ text: currentMessage });
    // scroll down
  };

  return (
    <>
      <NextSeo title="채팅" description="Bob과 대화를 나누어보아요." />
      {/*<pre>{JSON.stringify(hello.data)}</pre>*/}
      <main style={{ width: "100%", height: "100%" }}>
        {messages.length == 1 && (
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
        )}
        {messages.length > 1 && (
          <div className="chatting">
            <p className="time">{dayjs().format("YYYY.MM.DD HH:mm a")}</p>
            {messages.map((message, index) => (
              <div className={`speech ${message.speaker}`} key={index}>
                {message.content}
                {message.restaurants && (
                  <div className="menus">
                    {message.restaurants.map((restaurant, i) => (
                      <React.Fragment key={i}>
                        <RestaurantSelectComponent
                          restaurant={restaurant}
                          index={i + 1}
                        />
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
            {sendMessageMutation.isLoading ? (
              <CircleLoading size={30} />
            ) : (
              <NearMeIcon fill="#000000" size={20} suffixForId="nearMe" />
            )}
          </IconButton>
        </form>
      </main>
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
            padding-top: 120px;
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
