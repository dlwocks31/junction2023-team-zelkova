import React, { useEffect, useRef } from "react";
import Script from "next/script";
import { NaverMap, Coordinates } from "~/types/map";
import { ArrowLeftIcon, IconButton, toast } from "loplat-ui";
import Link from "next/link";
import { mutate } from "swr";

export const INITIAL_CENTER: Coordinates = [37.5262411, 126.99289439];
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
      minZoom: 9,
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

  /** GPS */
  useEffect(() => {
    const options = {
      enableHighAccuracy: true,
      timeout: 1000 * 5,
      maximumAge: 0,
    };

    function success(pos: GeolocationPosition) {
      const coords = pos.coords;
      mutate("current", [coords.latitude, coords.longitude]);
      mapRef.current?.setCenter(
        new naver.maps.LatLng(coords.latitude, coords.longitude)
      );
      toast.info(`오차 범위는 ${Math.round(coords.accuracy)}m 입니다.`);
    }

    function error() {
      toast.danger("현재 위치를 파악할 수 없습니다.");
    }

    const timer = setInterval(() => {
      navigator.geolocation.getCurrentPosition(success, error, options);
    }, 3000);

    return () => {
      clearInterval(timer);
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
      <Link href="/">
        <IconButton
          style={{
            position: "absolute",
            top: 16,
            left: 16,
          }}
        >
          <ArrowLeftIcon size={20} suffixForId="back" />
        </IconButton>
      </Link>
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
