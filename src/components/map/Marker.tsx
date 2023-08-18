import { useEffect } from "react";
import { NaverMap, Coordinates } from "~/types/map";

type Marker = {
  map: NaverMap;
  coordinates: Coordinates;
  icon?: ImageIcon;
  onClick?: () => void;
};
export type ImageIcon = {
  url: string;
  size?: naver.maps.Size;
  scaledSize?: naver.maps.Size;
};

const Marker = ({ map, coordinates, icon, onClick }: Marker): null => {
  useEffect(() => {
    let marker: naver.maps.Marker | null = null;
    if (map) {
      /** https://navermaps.github.io/maps.js.ncp/docs/tutorial-2-Marker.html */
      marker = new naver.maps.Marker({
        map: map,
        position: new naver.maps.LatLng(...coordinates),
        // icon,
      });
    }

    if (onClick) {
      naver.maps.Event.addListener(marker, "click", onClick);
    }

    return () => {
      marker?.setMap(null);
    };
  }, [map]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
};

export default Marker;
