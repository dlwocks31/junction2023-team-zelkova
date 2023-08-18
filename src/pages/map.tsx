import { NextSeo } from "next-seo";
import { api } from "~/utils/api";
import Map from "../components/map/Map";

export default function MapPage() {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <NextSeo title="지도" description="TODO" />
      <main
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <Map />
      </main>
    </>
  );
}
