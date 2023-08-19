import { useState } from "react";
import { api } from "~/utils/api";
export default function Test() {
  const { data: queryData } = api.getRestaurantSuggestion.useQuery({
    text: "피자 먹고싶어",
  });

  const [data, setData] = useState("");
  const [loading, setLoading] = useState(false);
  const onClick = async (type: string) => {
    setData("");
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/api/test/stream`, {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({ type }),
      });
      if (!response.ok || !response.body) {
        throw response.statusText;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          setLoading(false);
          break;
        }

        const decodedChunk = decoder.decode(value, { stream: true });

        setData((prevValue) => `${prevValue}${decodedChunk}`);
      }
    } catch (error) {
      setLoading(false);
    }
  };
  return (
    <div>
      <div>QueryData: {JSON.stringify(queryData)}</div>
      <button
        className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600 focus:outline-none"
        onClick={() => {
          onClick("id-suggest").catch(console.error);
        }}
      >
        ID Suggest Prompt
      </button>

      <button
        className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600 focus:outline-none"
        onClick={() => {
          onClick("dialogue").catch(console.error);
        }}
      >
        Dialogue Prompt
      </button>
      <div>Streamed At:</div>
      <div>{data}</div>
      <div>isLoading: {loading ? "true" : "false"}</div>
    </div>
  );
}
