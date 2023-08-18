import { NextSeo } from "next-seo";
import { api } from "~/utils/api";

export default function Home() {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <NextSeo title="홈" description="TODO" />
      <h1>test</h1>
    </>
  );
}
