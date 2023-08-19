import { z } from "zod";
import { exampleRouter } from "~/server/api/routers/example";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { dialogueQuery } from "../../openai/DialogueQuery";
import { RestaurantSuggestQuery } from "../../openai/RestaurantSuggestQuery";
import { restaurantData } from "../mock-db";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */

export const appRouter = createTRPCRouter({
  example: exampleRouter,
  findAllRestaurant: publicProcedure.input(z.object({})).query(({ ctx }) => {
    /*
    35.1659599,129.1319517/35.1670546,129.1340937
    */
    return restaurantData.map((restaurant) => ({
      ...restaurant,
      latitude: 35.1659599,
      longitude: 129.1319517,
    }));
  }),

  getRestaurantSuggestion: publicProcedure
    .input(z.object({ text: z.string() }))
    .mutation(async ({ input }) => {
      const restaurants = restaurantData;
      const queryResult = await RestaurantSuggestQuery(input.text, restaurants);
      const message = queryResult.choices[0]?.message?.content;
      try {
        if (!message) {
          throw new Error("message is undefined");
        }
        const jsonSuggestion = JSON.parse(message);
        console.log(typeof jsonSuggestion);
        console.log(jsonSuggestion);
        const parsedSuggestion = z
          .object({
            name: z.array(z.string()),
          })
          .parse(jsonSuggestion);
        if (parsedSuggestion.name.length === 0) {
          console.log("parsedSuggestion.name is undefined");
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
          message: await dialogueQuery(input.text),
        };
      } catch (e) {
        console.log(e);
        return {
          showSuggestion: false,
          message: message,
        };
      }
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
