import { NextSeo } from "next-seo";
import { useEffect, useState } from "react";
import useSWR from "swr";
import Marker, { generateParentMarkerIcon } from "~/components/map/Marker";
import { Coordinates } from "~/types/map";
import { api } from "~/utils/api";
import Map from "../components/map/Map";
import { calculateAngle } from "~/utils/math";

export default function MapPage() {
  const restaurant = api.findAllRestaurant.useQuery({});
  const [map, setMap] = useState<null | naver.maps.Map>(null);
  const { data: currentLocation } = useSWR<Coordinates>("current");
  const [paths, setPaths] = useState<Coordinates[]>([]);

  useEffect(() => {
    console.log(currentLocation);
    if (currentLocation) {
      setPaths((state) => [...state, currentLocation]);
    }
  }, [currentLocation]);

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
        {map &&
          paths
            .filter(Boolean)
            .map((coor, index) => (
              <Marker
                key={index}
                map={map}
                coordinates={coor}
                icon={generateParentMarkerIcon(
                  index === 0
                    ? 0
                    : calculateAngle(
                        paths[index - 1]?.[0] ?? 0,
                        paths[index - 1]?.[1] ?? 0,
                        paths[index]?.[0] ?? 0,
                        paths[index]?.[1] ?? 0
                      ),
                  index
                )}
              />
            ))}

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
