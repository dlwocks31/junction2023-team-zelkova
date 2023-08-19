export interface Restaurant {
  name: string;
  distance: number;
  picked: number;
  crowdDegree: number;
}

export const restaurantData: Restaurant[] = [
  {
    name: "BBQ Chicken",
    distance: 10,
    picked: 12,
    crowdDegree: 3,
  },
  {
    name: "Pizza Al Volo",
    distance: 14,
    picked: 97,
    crowdDegree: 2,
  },
  {
    name: "Pizza Hut",
    distance: 6,
    picked: 88,
    crowdDegree: 3,
  },
  {
    name: "Paik’s Pakboy Pizza",
    distance: 12,
    picked: 87,
    crowdDegree: 3,
  },
  {
    name: "Nakseong Korean Cuisine",
    distance: 12,
    picked: 87,
    crowdDegree: 3,
  },
];
