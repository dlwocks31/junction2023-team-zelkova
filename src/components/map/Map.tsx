import React, { useEffect, useRef } from "react";
import Script from "next/script";
import { NaverMap, Coordinates } from "~/types/map";
import { toast } from "loplat-ui";
import { mutate } from "swr";
import { calculateDistanceBetweenCoordinates } from "~/utils/math";

export const INITIAL_CENTER: Coordinates = [35.1663859, 129.1346072];
export const INITIAL_ZOOM = 16;

type Props = {
  initialCenter?: Coordinates;
  initialZoom?: number;
  onLoad?: (map: NaverMap) => void;
};

const mapId = "map";

const Map = ({
  initialCenter = INITIAL_CENTER,
  initialZoom = INITIAL_ZOOM,
  onLoad,
}: Props) => {
  const mapRef = useRef<NaverMap | null>(null);

  const initializeMap = () => {
    const mapOptions = {
      center: new window.naver.maps.LatLng(...initialCenter),
      zoom: initialZoom,
      minZoom: 16,
      scaleControl: false,
      mapDataControl: false,
      logoControlOptions: {
        position: naver.maps.Position.BOTTOM_LEFT,
      },
    };

    /** https://navermaps.github.io/maps.js.ncp/docs/tutorial-2-Getting-Started.html */
    const map = new window.naver.maps.Map(mapId, mapOptions);
    mapRef.current = map;

    if (onLoad) {
      onLoad(map);
    }
  };

  useEffect(() => {
    return () => {
      mapRef.current?.destroy();
    };
  }, []);

  /** GPS **/
  useEffect(() => {
    const options = {
      enableHighAccuracy: false,
      timeout: 5 * 1000,
      maximumAge: 0,
    };

    let beforeRecord: Coordinates = [34.1650838, 129.1356638];

    function success(pos: any) {
      const coords = pos.coords;
      const newCoords: Coordinates = [
        coords.latitude,
        coords.longitude,
      ] as Coordinates;

      if (calculateDistanceBetweenCoordinates(beforeRecord, newCoords) > 0.02) {
        mutate("currentLocation", newCoords);
        beforeRecord = newCoords;
      }
    }

    function error() {
      toast.danger("please use the PWA app");
    }

    const watchId = navigator.geolocation.watchPosition(
      success,
      error,
      options
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return (
    <>
      <Script
        strategy="afterInteractive"
        type="text/javascript"
        src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NCP_CLIENT_ID}`}
        onReady={initializeMap}
      />
      <div id={mapId} className="naverMap" />

      <style jsx>
        {`
          .naverMap {
            width: 100%;
            height: 100%;
          }
        `}
      </style>
    </>
  );
};

export default Map;
