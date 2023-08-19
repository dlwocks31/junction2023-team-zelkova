import { ChatComponent, Message } from "../components/Chat";
import { api } from "../utils/api";
export default function ChatIndex() {
  const sendMessageMutation = api.getPickupWayMessage.useMutation();

  const getNextMessage = async ({
    allMessages,
  }: {
    allMessages: Message[];
  }) => {
    const { message } = await sendMessageMutation.mutateAsync(allMessages);
    return {
      speaker: "bot" as const,
      content: message,
    };
  };

  return (
    <main className="flex w-screen items-center" style={{ height: "100vh" }}>
      <ChatComponent
        initialMessages={[
          {
            speaker: "bot",
            content:
              "How was the pick up? This is your second pick up with me already🤭",
          },
        ]}
        getNextMessage={getNextMessage}
        actionButtons={[
          {
            text: "Pick up complete!",
            callback: () => {
              return;
            },
          },
          {
            text: "I don't want to talk anymore.",
            callback: () => {
              return;
            },
          },
        ]}
      />
    </main>
  );
}
