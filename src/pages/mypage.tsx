import { NextSeo } from "next-seo";
import { useState } from "react";
import useSWR from "swr";
import { useRouter } from "next/router";

export default function Mypage() {
  const router = useRouter();
  const [paymentImageState, setPaymentImageState] = useState("initial");

  return (
    <>
      <NextSeo title="내 정보" description="TODO" />
      <main
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
        }}
      >
        <img src="/image/myPageView.png" alt="" style={{ width: "100%" }} />
      </main>
      <style jsx>{``}</style>
    </>
  );
}
