import { useState, useCallback } from "react";
import { getSessionId } from "../utils/session";

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [toolActivity, setToolActivity] = useState([]);
  const [error, setError] = useState(null);

  const sendMessage = useCallback(async (text, birthDetails = null) => {
    setError(null);
    const sessionId = getSessionId();

    // Optimistically add user message
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setIsStreaming(true);
    setToolActivity([]);

    let assistantContent = "";
    // Add a placeholder for the streaming assistant message
    setMessages((prev) => [...prev, { role: "assistant", content: "", streaming: true }]);

    try {
      const res = await fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, sessionId, birthDetails }),
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter((l) => l.startsWith("data:"));

        for (const line of lines) {
          const data = JSON.parse(line.slice(5).trim());

          if (data.type === "token") {
            assistantContent += data.text;
            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = { role: "assistant", content: assistantContent, streaming: true };
              return updated;
            });
          }

          if (data.type === "tool_call") {
            setToolActivity((prev) => [...prev, data.tool]);
          }

          if (data.type === "done") {
            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = { role: "assistant", content: assistantContent, streaming: false };
              return updated;
            });
            setIsStreaming(false);
          }

          if (data.type === "error") {
            setError(data.text);
            setIsStreaming(false);
          }
        }
      }
    } catch (err) {
      setError("Connection failed. Is the backend running?");
      setIsStreaming(false);
    }
  }, []);

  return { messages, sendMessage, isStreaming, toolActivity, error };
}
