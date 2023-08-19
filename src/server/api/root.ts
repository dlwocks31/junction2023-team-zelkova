import { z } from "zod";
import { exampleRouter } from "~/server/api/routers/example";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

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
    return [
      {
        id: 1,
        name: "Restaurant 1",
        description: "Description 1",
        latitude: 35.1659599,
        longitude: 129.1319517,
        menus: [
          {
            id: 1,
            name: "Menu 1",
            price: 10000,
          },
          {
            id: 2,
            name: "Menu 2",
            price: 20000,
          },
        ],
      },
      {
        id: 2,
        name: "Restaurant 2",
        description: "Description 2",
        latitude: 35.1670546,
        longitude: 129.1340937,
        menus: [
          {
            id: 3,
            name: "Menu 3",
            price: 30000,
          },
          {
            id: 4,
            name: "Menu 4",
            price: 40000,
          },
        ],
      },
    ];
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
