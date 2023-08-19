import { openaiNonStream } from "./openai";

export const dialogueQuery = (userInput: string) => {
  const systemPrompt = `You are a chatbot that recommends restaurants to users. In response to the user's question, please display a comment in the format of "You want XXX! I've got XXX for you 🤭". 
You may slightly alter this format, given that you keeps the original tone of the response. Speak informally and in a friendly manner.

Below is an example conversation.
User:
I want pizza. A place with high ratings.
Assistant:
You want a highly-rated pizza! I've got some good pizza places for you 🤭
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
