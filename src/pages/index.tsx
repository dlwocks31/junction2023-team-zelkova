import { ChatComponent, Message } from "../components/Chat";
import { Restaurant } from "../server/mock-db";
import { api } from "../utils/api";

export default function ChatIndex() {
  const sendMessageMutation = api.getRestaurantSuggestion.useMutation();
  const restaurants = api.findAllRestaurant.useQuery({});
  const getNextMessage = async ({
    allMessages,
  }: {
    allMessages: Message[];
  }): Promise<Message> => {
    const data = await sendMessageMutation.mutateAsync(allMessages);
    if (data.showSuggestion) {
      const { message, suggestion } = data;
      if (!message || !suggestion)
        throw new Error("message or suggestions is null");

      return {
        speaker: "bot",
        content: message,
        restaurants: suggestion
          .map((s) => restaurants.data?.find((r) => r.name === s.name))
          .filter((r) => r) as Restaurant[],
      };
    } else {
      const message = data.message;
      if (!message) throw new Error("message is null");
      return {
        speaker: "bot",
        content: message,
      };
    }
  };

  return (
    <main className="flex w-full flex-col" style={{ height: "100dvh" }}>
      <ChatComponent
        initialMessages={[
          {
            speaker: "bot",
            content:
              "Do you want something to eat now? Let's go get it together 😋",
          },
        ]}
        getNextMessage={getNextMessage}
        showIntroOnSingleMessage={true}
      />
    </main>
  );
}
