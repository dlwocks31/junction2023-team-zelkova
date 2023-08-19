import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI();

const restaurantPrompt = `BBQ치킨 낙성대점 / id 2 / 거리 0.7km / 평점 4.2
BBQ치킨 서울대입구역점 / id 3 / 거리 2.3km / 평점 4.7
도미노피자 서울대입구역점 / id 5 / 거리 1.1km / 평점 4.7
피자헛 부산센텀점 / id 7 / 거리 1.0km / 평점 2.3
피자알볼로 해운대점 / id 11 / 거리 4.1km / 평점 4.1
낙성백반 / id 13 / 거리 0.5km / 평점 4.8`;

const systemIDSuggestPrompt = `당신은 유저에게 식당을 추천해주는 챗봇입니다. 유저가 음식과 무관한 메세지를 보내면 거절해야 합니다.
현재 유저 주변에는 아래와 같은 식당이 있습니다:

${restaurantPrompt}

유저가 식당 추천을 요청하면, 유저가 원하는 조건에 맞는 식당 이름을 JSON으로 출력하세요. 유저가 요청한 종류의 음식과 다른 종류의 식당을 출력하지 않아야 합니다.

아래는 대화 예시입니다.
User:
피자 먹고싶어. 평점 높은 곳으로
Assistant:
{name: ["도미노피자 서울대입구역점", "피자헛 부산센텀점", "피자알볼로 해운대점"]}

User:
로버트는 얼마나 좋았을까?
Assistant:
식당 추천 외의 내용은 도와줄 수 없어. 여기 근처 맛집 정보 원하면 말해! 😆
`;

const systemDialoguePrompt = `당신은 유저에게 식당을 추천해주는 챗봇입니다. 유저의 질문에 대해 "XXX를 먹고 싶군! XXX을 가져왔어 🤭" 형식의 멘트를 출력하세요. 형식 외에는 아무것도 출력하지 마세요. 친근하게 반말을 사용하세요.

아래는 대화 예시입니다.
User:
피자 먹고싶어. 평점 높은 곳으로
Assistant:
평점이 높은 피자를 먹고 싶군! 괜찮은 피자집을 가져왔어 🤭
`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body = await req.json();
  const { type } = body;
  console.log(type);
  const systemPrompt =
    type === "id-suggest" ? systemIDSuggestPrompt : systemDialoguePrompt;
  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      const stream = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: "치킨을 먹고 싶어. 평점 높은 곳으로 알려줘",
          },
        ],
        model: "gpt-3.5-turbo",
        stream: true,
      });
      for await (const part of stream) {
        const content = part.choices[0]?.delta.content;
        if (content) {
          console.log(content);
          controller.enqueue(encoder.encode(content));
        }
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

export const config = {
  runtime: "edge",
};
