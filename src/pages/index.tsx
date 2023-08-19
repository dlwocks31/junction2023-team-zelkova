import { NextSeo } from "next-seo";
import { api } from "~/utils/api";
import dayjs from "dayjs";
import { IconButton, NearMeIcon } from "loplat-ui";
import { useState } from "react";

export default function Home() {
  const hello = api.findAllRestaurant.useQuery({});
  const [messages, setMessages] = useState<
    {
      speaker: "bot" | "human";
      content: string;
    }[]
  >([]);

  const [currentMessage, setCurrentMessage] = useState("");
  const sendMessage = () => {
    setMessages((state) => [
      ...state,
      { speaker: "human", content: currentMessage },
    ]);
    setCurrentMessage("");
  };

  return (
    <>
      <NextSeo title="채팅" description="Bob과 대화를 나누어보아요." />
      {/*<pre>{JSON.stringify(hello.data)}</pre>*/}
      <main style={{ width: "100%", height: "100%" }}>
        {messages.length === 0 && (
          <div className="intro">
            <div className="rabbit">
              <div className="speech">
                Do you want something to eat now? Let&apos;s go get it together
                😋
              </div>
              <img
                src="/gif/walking.gif"
                alt=""
                style={{ width: "50%", margin: "auto" }}
              />
            </div>
          </div>
        )}
        {messages.length > 0 && (
          <div>
            <p className="time">{dayjs().format("YYYY.MM.DD HH:mm a")}</p>
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
              setCurrentMessage(e.target.value);
            }}
          />
          <IconButton variant="ghost2" borderless>
            <NearMeIcon fill="#000000" size={20} suffixForId="nearMe" />
          </IconButton>
        </form>
      </main>
      <style jsx>
        {`
          .time {
            padding-top: 24px;
            text-align: center;
            font-size: 14px;
            color: #3c3c43;
          }
          .intro {
            position: relative;
            margin-top: 120px;
            width: 100%;

            .rabbit {
              width: 100%;
            }

            .speech {
              position: relative;
              background-color: #dde9fc;
              border-radius: 20px;
              padding: 10px 32px;
              margin: auto;
              width: fit-content;
              max-width: 300px;
              text-align: center;
            }
            .speech::before {
              content: "";
              position: absolute;
              bottom: -20px;
              left: 50%;
              transform: translateX(-50%);
              border-style: solid;
              border-width: 10px;
              border-color: #dde9fc transparent transparent transparent;
            }
          }
          .sendMessage {
            position: absolute;
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
