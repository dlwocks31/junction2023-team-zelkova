import { Restaurant } from "../server/mock-db";
import { openaiNonStream } from "./openai";

export const RestaurantSuggestQuery = (
  userInput: string,
  restaurants: Restaurant[]
) => {
  const restaurantPrompt = restaurants
    .map((restaurant) => restaurant.name)
    .join("\n");
  const systemPrompt = `You are a chatbot that recommends restaurants to users. If the user sends a message unrelated to food, you should decline. The following restaurants are currently near the user:

${restaurantPrompt}

If the user requests a restaurant recommendation, please output the name of the restaurant that fits the user's criteria in JSON format. Do not output restaurants that do not match the type of food the user requested.
If the user asks for restaurant recommendations without specifying a type of food, output the names of random restaurants in JSON format.
If the user asks for restaurant recommendations which does not exist in list, return an empty list.

Below is an example conversation.
User:
I want to eat pizza.
Assistant:
{name: ["Domino's Pizza Seoul National University Station", "Pizza Hut Busan Centum City", "Pizza Al Volo Haeundae"]}

User:
I wonder how great Robert was?
Assistant:
I can't help with topics other than restaurant recommendations. If you want information on nearby delicious places, let me know! 😆`;
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
