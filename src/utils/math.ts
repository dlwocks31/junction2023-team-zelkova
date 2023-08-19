/** 두 좌표 사이의 각도를 계산하는 함수 */
import { Coordinates } from "~/types/map";

export function calculateAngle(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const y = Math.sin(dLon) * Math.cos(lat2 * (Math.PI / 180));
  const x =
    Math.cos(lat1 * (Math.PI / 180)) * Math.sin(lat2 * (Math.PI / 180)) -
    Math.sin(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.cos(dLon);

  const angleRad = Math.atan2(y, x);
  const angleDeg = (angleRad * 180) / Math.PI;

  return (angleDeg + 360) % 360;
}

/**
 * Haversine formula를 이용하여 두 좌표 사이의 최단 거리(km)를 계산하는 함수
 * chrome에서 1000회 실행시 약 0.2ms
 */
export function calculateDistanceBetweenCoordinates(
  coordinates1: Coordinates,
  coordinates2: Coordinates
): number {
  function degreeToRadian(degree: number) {
    return degree * (Math.PI / 180);
  }
  function square(x: number) {
    return x ** 2;
  }
  const r = 6371; // 지구 반지름(km)
  const degLat1 = degreeToRadian(coordinates1[0]);
  const degLat2 = degreeToRadian(coordinates2[0]);
  const latDif = degLat2 - degLat1;
  const lngDif = degreeToRadian(coordinates2[1] - coordinates1[1]);
  const result =
    square(Math.sin(latDif / 2)) +
    Math.cos(degLat1) * Math.cos(degLat2) * square(Math.sin(lngDif / 2));
  return 2 * r * Math.asin(Math.sqrt(result));
}
