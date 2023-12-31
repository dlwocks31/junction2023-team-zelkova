import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { toast } from "loplat-ui";
import { Fade } from "react-awesome-reveal";

export default function AlarmPage() {
  const router = useRouter();

  const navigateToMap = () => {
    router.push("/map");
    toast.success("I'll let you know when it's time to go!");
    notifyMe();
  };

  /** notification **/
  function notifyMe() {
    navigator.serviceWorker.register("sw.js").then(() => {
      if (!("Notification" in window)) {
        // Check if the browser supports notifications
        alert("This browser does not support desktop notification");
      } else if (Notification.permission === "granted") {
        // Check whether notification permissions have already been granted;
        // if so, create a notification
        navigator.serviceWorker.ready.then((registration) => {
          setTimeout(() => {
            registration.showNotification("It's time to go!", {
              body: "Zelkova, Let's go!",
              icon: "/thumbnail-512x512.png",
              vibrate: 200,
            });
          }, 5000);
        });
      } else if (Notification.permission !== "denied") {
        // We need to ask the user for permission
        Notification.requestPermission().then((permission) => {
          // If the user accepts, let's create a notification
          if (permission === "granted") {
            navigator.serviceWorker.ready.then((registration) => {
              setTimeout(() => {
                registration.showNotification("It's time to go!", {
                  body: "Zelkova, Let's go!",
                  icon: "/thumbnail-512x512.png",
                  vibrate: 200,
                });
              }, 5000);
            });
          }
        });
      }
    });
  }

  return (
    <>
      <NextSeo title="alarm" description="ready to order" />
      <main
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <div className="intro">
          <div className="rabbit">
            <div className="title">Pizza Albolo</div>
            <div className="subtitle">Order Placed</div>
            <Fade direction="up">
              <div className="speech">
                Okay, I'm ready.
                <br />
                30m for the pizza to be ready, <br />
                and 14, to get to the store.
                <br />
                Why don't we leave in 16 minutes?
              </div>
            </Fade>
            <img
              src="/gif/preparing.gif"
              alt=""
              style={{ width: "50%", margin: "auto" }}
            />
            <button className="alarmButton" onClick={navigateToMap}>
              Remind me when to leave!
            </button>
          </div>
        </div>
      </main>
      <style jsx>
        {`
          .intro {
            position: relative;
            padding-top: 120px;
            width: 100%;
            text-align: center;
          }
          .rabbit {
            width: 100%;
          }
          .title {
            color: var(--label-color-light-primary, #000);
            font-family: Noto Sans KR;
            font-size: 28px;
            font-style: normal;
            font-weight: 700;
            line-height: 22px; /* 78.571% */
            letter-spacing: -0.408px;
            margin: 10px;
          }
          .subtitle {
            color: #2e6ac8;
            font-family: Noto Sans KR;
            font-size: 17px;
            font-style: normal;
            font-weight: 700;
            line-height: 22px; /* 129.412% */
            margin-bottom: 40px;
          }
          .speech {
            position: relative;
            background-color: #dde9fc;
            border-radius: 20px;
            padding: 10px 32px;
            margin: 16px auto;
            width: fit-content;
            max-width: 320px;
            text-align: center;
            border: none;
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
          .alarmButton {
            position: fixed;
            bottom: 40px;
            margin: auto;
            left: 0;
            right: 0;
            width: 350px;
            height: 55px;
            border-radius: 10px;
            border: 2px solid #2e6ac8;
            background: #2e6ac8;
            box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
            color: #fff;
            text-align: center;
            font-family: Noto Sans;
            font-size: 20px;
            font-style: normal;
            font-weight: 700;
            line-height: 22px;
          }
        `}
      </style>
    </>
  );
}
