import { NextSeo } from "next-seo";
import { useState } from "react";
import useSWR from "swr";
import { useRouter } from "next/router";

export default function Order() {
  const [pageState, setPageState] = useState("menu");
  const router = useRouter();

  const handleButtonClick = () => {
    switch (pageState) {
      case "menu":
        setPageState("order");
        break;
      case "order":
        setPageState("payment");
        break;
      case "payment":
        router.push("/alarm");
      default:
        router.push("/map");
        break;
    }
  };

  const getImageSrc = () => {
    switch (pageState) {
      case "menu":
        return "/image/menuView.png";
      case "order":
        return "/image/orderView.png";
      case "payment":
        return "/image/paymentHeadView.png";
      default:
        return "/image/menuView.png";
    }
  };

  const getButtonText = () => {
    switch (pageState) {
      case "menu":
        return "Order";
      case "order":
        return "Pay 21,800 won";
      case "payment":
        return "Pay 21,800 won now";
      default:
        return "Order";
    }
  };

  return (
    <>
      <NextSeo title="음식점 페이지" description="TODO" />
      <main
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <img src={getImageSrc()} alt="" style={{ width: "100%" }} />
        <button className="button" onClick={handleButtonClick}>
          {getButtonText()}
        </button>
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
          .button {
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
            font-size: 24px;
            font-style: normal;
            font-weight: 700;
            line-height: 22px;
          }
        `}
      </style>
    </>
  );
}
