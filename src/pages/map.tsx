import { NextSeo } from "next-seo";
import { api } from "~/utils/api";
import Map from "../components/map/Map";
import { useState } from "react";
import Marker from "~/components/map/Marker";
import useSWR from "swr";

export default function MapPage() {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });
  const [map, setMap] = useState<null | naver.maps.Map>(null);
  const { data: currentLocation } = useSWR("current");

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
        <Map onLoad={setMap} />
        {map && currentLocation && (
          <Marker map={map} coordinates={currentLocation} />
        )}
      </main>
    </>
  );
}
