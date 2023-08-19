import OpenAI from "openai";

const openai = new OpenAI();

export const openaiStream = (
  model: "gpt-4" | "gpt-3.5-turbo",
  messages: { role: "system" | "user"; content: string }[],
  encode = true
) => {
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      const stream = await openai.chat.completions.create({
        messages,
        model,
        stream: true,
      });
      for await (const part of stream) {
        const content = part.choices[0]?.delta.content;
        if (content) {
          controller.enqueue(encode ? encoder.encode(content) : content);
        }
      }
      controller.close();
    },
  });

  return readable;
};

export const openaiNonStream = (
  model: "gpt-4" | "gpt-3.5-turbo",
  messages: { role: "system" | "user"; content: string }[]
) => {
  return openai.chat.completions.create({
    messages,
    model,
  });
};
