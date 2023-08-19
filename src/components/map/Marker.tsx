import { useEffect } from "react";
import { NaverMap, Coordinates } from "~/types/map";

type Marker = {
  map: NaverMap;
  coordinates: Coordinates;
  icon?: ContentIcon;
  onClick?: () => void;
};
export interface ContentIcon {
  content: string;
  size?: naver.maps.Size;
  scaledSize?: naver.maps.Size;
  anchor: naver.maps.Point;
}

export function generateParentMarkerIcon(
  angle: number,
  index?: number
): ContentIcon {
  const size = 60;
  return {
    content: [
      `<div style="width: ${size}px; height: ${size}px; border-radius: 50%; transform: rotate(${angle}deg);
                           display: flex; align-items: center; justify-content: center">`,
      `<img src="/icon/footprint.svg" width="20" height="20" alt="발" />`,
      `<p>${index}</p>`,
      `</div>`,
    ].join(""),
    anchor: new naver.maps.Point(size / 2, size / 2),
  };
}

const Marker = ({ map, coordinates, icon, onClick }: Marker): null => {
  useEffect(() => {
    let marker: naver.maps.Marker | null = null;
    if (map) {
      /** https://navermaps.github.io/maps.js.ncp/docs/tutorial-2-Marker.html */
      marker = new naver.maps.Marker({
        map: map,
        position: new naver.maps.LatLng(...coordinates),
        icon,
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
