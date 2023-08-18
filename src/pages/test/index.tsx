import { useState } from "react";

export default function Test() {
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(false);
  const onClick = async () => {
    console.log("test");
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/api/test/stream");
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
      <div>Hello, World!</div>
      <button
        className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600 focus:outline-none"
        onClick={() => {
          onClick().catch(console.error);
        }}
      >
        Click me
      </button>
      <div>Streamed At:</div>
      <div>{data}</div>
      <div>isLoading: {loading ? "true" : "false"}</div>
    </div>
  );
}
