import { NextSeo } from "next-seo";
import { useState } from "react";
import useSWR from "swr";
import { useRouter } from "next/router";

export default function Order() {
  const [pageState, setPageState] = useState("menu");
  const [clickCounts, setClickCounts] = useState({
    option1: 0,
    option2: 0,
    option3: 0,
  });
  const router = useRouter();
  type OptionType = "option1" | "option2" | "option3";

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

  const handleImageClick = (option: OptionType) => {
    setClickCounts((prev) => ({ ...prev, [option]: prev[option] + 1 }));
  };

  const getTotalClicks = () => {
    return clickCounts.option1 + clickCounts.option2 + clickCounts.option3;
  };

  const getImageSrcs = () => {
    switch (pageState) {
      case "menu":
        return [
          "/image/menuHeadView.png",
          "/image/menuOption1.png",
          "/image/menuOption2.png",
          "/image/menuOption3.png",
          "/image/menuFootView.png",
        ];
      case "order":
        return ["/image/orderView.png"];
      default:
        return [
          "/image/menuHeadView.png",
          "/image/menuOption1.png",
          "/image/menuOption2.png",
          "/image/menuOption3.png",
          "/image/menuFootView.png",
        ];
    }
  };

  const imageStyle = (src: string) => {
    if (src.includes("menuOption")) {
      return {
        width: "100%",
        marginTop: "10px",
        cursor: "pointer",
      };
    } else {
      return { width: "100%" };
    }
  };

  const getButtonText = () => {
    switch (pageState) {
      case "menu":
        if (getTotalClicks() == 1) {
          return `Order ${getTotalClicks()} Menu`;
        } else if (getTotalClicks() > 1) {
          return `Order ${getTotalClicks()} Menus`;
        }
        return "Order";
      case "order":
        return "Pay 21,800 won";
      default:
        return "Order";
    }
  };

  const getButtonStyle = () => {
    if (getTotalClicks() > 0) {
      return {
        backgroundColor: "#2e6ac8",
        borderColor: "#2e6ac8",
      };
    }

    return {
      background: "#c1c1c1",
      border: "2px solid #c1c1c1",
    };
  };

  return (
    <>
      <NextSeo title="음식점 페이지" description="TODO" />
      <main
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          overflow: "scroll",
          paddingBottom: "100px",
        }}
      >
        {getImageSrcs().map((src, index) => (
          <img
            key={index}
            src={src}
            alt=""
            style={imageStyle(src)}
            onClick={() => {
              if (src.includes("menuOption1")) handleImageClick("option1");
              if (src.includes("menuOption2")) handleImageClick("option2");
              if (src.includes("menuOption3")) handleImageClick("option3");
            }}
          />
        ))}
        <button
          className="button"
          onClick={handleButtonClick}
          style={getButtonStyle()}
        >
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
