import { z } from "zod";
import { exampleRouter } from "~/server/api/routers/example";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { pickupWayQuery } from "../../openai/PickupWayQuery";
import { RestaurantSuggestQuery } from "../../openai/RestaurantSuggestQuery";
import { restaurantData } from "../mock-db";

function extractJSONFromString(str: string) {
  try {
    const startIndex = str.indexOf("{");
    const endIndex = str.lastIndexOf("}");
    console.log(startIndex, endIndex);

    if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
      const jsonString = str.substring(startIndex, endIndex + 1);
      console.log("found jsonlike: ", jsonString);
      const extractedJSON = JSON.parse(jsonString);
      const strippedString = str.replace(jsonString, "");
      console.log("extractedJSON: ", extractedJSON);
      return { isValidJSON: true, extractedJSON, strippedString };
    }

    console.log("is not valid json - json not detected");
    return { isValidJSON: false };
  } catch (error) {
    console.log("is not valid json - parse failed");
    return { isValidJSON: false };
  }
}

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */

export const appRouter = createTRPCRouter({
  example: exampleRouter,
  findAllRestaurant: publicProcedure.input(z.object({})).query(({ ctx }) => {
    return restaurantData;
  }),

  getRestaurantSuggestion: publicProcedure
    .input(
      z.array(
        z.object({
          speaker: z.enum(["bot", "human"]),
          content: z.string(),
        })
      )
    )
    .mutation(async ({ input }) => {
      const restaurants = restaurantData;
      const queryResult = await RestaurantSuggestQuery(
        input.map((i) => ({
          role: i.speaker === "bot" ? "assistant" : "user",
          content: i.content,
        })),
        restaurants
      );
      const message = queryResult.choices[0]?.message?.content;
      console.log("Message: ", message);
      try {
        if (!message) {
          throw new Error("message is undefined");
        }
        const extractResult = extractJSONFromString(message);
        if (extractResult.isValidJSON) {
          const parsedSuggestion = z
            .object({
              name: z.array(z.string()),
            })
            .parse(extractResult.extractedJSON);
          if (parsedSuggestion.name.length === 0) {
            console.log(
              "This case should not happen! Avoid this with better prompt."
            );
            return {
              showSuggestion: false,
              message:
                "Unfortunatly, I cannot find any relevant restaurant nearby 😭",
            };
          }
          return {
            showSuggestion: true,
            suggestion: parsedSuggestion.name.map((name) => ({
              name,
            })),
            message: extractResult.strippedString,
          };
        } else {
          return {
            showSuggestion: false,
            message,
          };
        }
      } catch (error) {
        console.log(error);
        return {
          showSuggestion: false,
          message,
        };
      }
    }),

  getPickupWayMessage: publicProcedure
    .input(
      z.array(
        z.object({
          speaker: z.enum(["bot", "human"]),
          content: z.string(),
        })
      )
    )
    .mutation(async ({ input }) => {
      const message = await pickupWayQuery(
        input.map((i) => ({
          role: i.speaker === "bot" ? "assistant" : "user",
          content: i.content,
        }))
      );
      if (message) {
        return {
          message,
        };
      } else {
        throw new Error("message is undefined");
      }
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
