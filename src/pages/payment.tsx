import { NextSeo } from "next-seo";
import { useState } from "react";
import useSWR from "swr";
import { useRouter } from "next/router";

export default function Payment() {
  const [pageState, setPageState] = useState("menu");
  const router = useRouter();
  const [paymentImageState, setPaymentImageState] = useState("initial");

  const handleButtonClick = () => {
    router.push("/alarm");
  };

  const handlePaymentImageClick = () => {
    switch (paymentImageState) {
      case "initial":
        setPaymentImageState("face");
        console.log("face");
        break;
      case "face":
        setPaymentImageState("card");
        console.log("card");
        break;
      case "card":
        setPaymentImageState("face");
        console.log("face");
        break;
      default:
        break;
    }
  };

  const getHeadImageSrc = () => {
    switch (paymentImageState) {
      case "initial":
        return "/image/paymentHeadView.png";
      case "face":
        return "/image/paymentHeadFace.png";
      case "card":
        return "/image/paymentHeadCard.png";
      default:
        return "/image/paymentHeadView.png";
    }
  };

  const getImageSrc = () => {
    switch (paymentImageState) {
      case "face":
        return "/image/paymentFaceView.png";
      case "card":
        return "/image/paymentCardView.png";
      default:
        return "";
    }
  };

  return (
    <>
      <NextSeo title="결제 페이지" description="TODO" />
      <main
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <img
          src={getHeadImageSrc()}
          alt=""
          onClick={handlePaymentImageClick}
          style={{ width: "100%", cursor: "pointer" }}
        />
        <img
          src={getImageSrc()}
          alt=""
          style={{ width: "100%", cursor: "pointer" }}
        />

        <button className="button" onClick={handleButtonClick}>
          Pay 21,800 won now
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
