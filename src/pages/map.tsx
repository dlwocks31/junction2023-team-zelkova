import { NextSeo } from "next-seo";
import { useState } from "react";
import useSWR from "swr";
import Marker from "~/components/map/Marker";
import { Coordinates } from "~/types/map";
import { api } from "~/utils/api";
import Map from "../components/map/Map";

export default function MapPage() {
  const restaurant = api.findAllRestaurant.useQuery({});
  const [map, setMap] = useState<null | naver.maps.Map>(null);
  const { data: currentLocation } = useSWR<Coordinates>("current");

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
        {/** TODO: make restaurant look different */}
        {map &&
          restaurant.data?.map((item) => (
            <Marker
              key={item.id}
              map={map}
              coordinates={[item.latitude, item.longitude]}
              onClick={() => {
                alert(item.name);
              }}
            />
          ))}
      </main>
    </>
  );
}
