import { PickupWayQuery } from "./PickupWayQuery";

describe("PickupWayQuery", () => {
  it("works", async () => {
    const result = await PickupWayQuery([
      {
        role: "user",
        content: "I'm still feeling nervous about going out.",
      },
    ]);

    console.log(result);
  }, 10000);
});
