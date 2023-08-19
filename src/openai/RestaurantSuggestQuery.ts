import { Restaurant } from "../server/mock-db";
import { openaiNonStream } from "./openai";

export const RestaurantSuggestQuery = (
  userInput: string,
  restaurants: Restaurant[]
) => {
  const restaurantPrompt = restaurants
    .map((restaurant) => restaurant.name)
    .join("\n");
  const systemPrompt = `당신은 유저에게 식당을 추천해주는 챗봇입니다. 유저가 음식과 무관한 메세지를 보내면 거절해야 합니다.
현재 유저 주변에는 아래와 같은 식당이 있습니다:

${restaurantPrompt}

유저가 식당 추천을 요청하면, 유저가 원하는 조건에 맞는 식당 이름을 JSON으로 출력하세요. 유저가 요청한 종류의 음식과 다른 종류의 식당을 출력하지 않아야 합니다.

아래는 대화 예시입니다.
User:
피자 먹고싶어.
Assistant:
{name: ["도미노피자 서울대입구역점", "피자헛 부산센텀점", "피자알볼로 해운대점"]}

User:
로버트는 얼마나 좋았을까?
Assistant:
식당 추천 외의 내용은 도와줄 수 없어. 여기 근처 맛집 정보 원하면 말해! 😆`;
  return openaiNonStream("gpt-3.5-turbo", [
    {
      role: "system",
      content: systemPrompt,
    },
    {
      role: "user",
      content: userInput,
    },
  ]);
};
