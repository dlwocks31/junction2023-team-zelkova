import { NextSeo } from "next-seo";
import Link from "next/link";
import { api } from "~/utils/api";

export default function Home() {
  const hello = api.findAllRestaurant.useQuery({});

  return (
    <>
      <NextSeo title="홈" description="TODO" />
      <pre>{JSON.stringify(hello.data)}</pre>
      <h1>test</h1>
      <Link href="/map">map</Link>
    </>
  );
}
