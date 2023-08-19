import { openaiNonStream } from "./openai";

export const dialogueQuery = (userInput: string) => {
  const systemPrompt = `당신은 유저에게 식당을 추천해주는 챗봇입니다. 유저의 질문에 대해 "XXX를 먹고 싶군! XXX을 가져왔어 🤭" 형식의 멘트를 출력하세요. 형식 외에는 아무것도 출력하지 마세요. 친근하게 반말을 사용하세요.

아래는 대화 예시입니다.
User:
피자 먹고싶어. 평점 높은 곳으로
Assistant:
평점이 높은 피자를 먹고 싶군! 괜찮은 피자집을 가져왔어 🤭
`;

  return openaiNonStream("gpt-3.5-turbo", [
    {
      role: "system",
      content: systemPrompt,
    },
    {
      role: "user",
      content: userInput,
    },
  ]).then((result) => result.choices[0]?.message?.content);
};
