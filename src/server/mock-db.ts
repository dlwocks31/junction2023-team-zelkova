export interface Restaurant {
  name: string;
  distance: number;
  picked: number;
  crowdDegree: number;
  latitude: number;
  longitude: number;
}

export const restaurantData: Restaurant[] = [
  {
    name: "BBQ Chicken",
    distance: 10,
    picked: 12,
    crowdDegree: 3,
    latitude: 35.1681108,
    longitude: 129.1379291,
  },
  {
    name: "Pizza Alvolo",
    distance: 14,
    picked: 97,
    crowdDegree: 2,
    latitude: 35.1681108,
    longitude: 129.1379291,
  },
  {
    name: "Pizza Hut",
    distance: 6,
    picked: 88,
    crowdDegree: 3,
    latitude: 35.1681108,
    longitude: 129.1379291,
  },
  {
    name: "Paik's Pakboy Pizza",
    distance: 12,
    picked: 87,
    crowdDegree: 3,
    latitude: 35.1681108,
    longitude: 129.1379291,
  },
  {
    name: "Nakseong Korean Cuisine",
    distance: 12,
    picked: 87,
    crowdDegree: 3,
    latitude: 35.1681108,
    longitude: 129.1379291,
  },
];
