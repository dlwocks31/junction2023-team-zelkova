import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      const stream = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant.",
          },
          {
            role: "user",
            content: "Tell me about what is PWA in one short sentence.",
          },
        ],
        model: "gpt-3.5-turbo",
        stream: true,
      });
      for await (const part of stream) {
        console.log(part.choices[0]?.delta.content);
        const content = part.choices[0]?.delta.content;
        if (content) {
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
