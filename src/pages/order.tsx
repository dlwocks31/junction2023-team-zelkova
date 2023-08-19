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
        router.push("/payment");
        break;
    }
  };

  const getImageSrc = () => {
    switch (pageState) {
      case "menu":
        return "/image/menuView.png";
      case "order":
        return "/image/orderView.png";
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
