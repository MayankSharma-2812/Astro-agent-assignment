import { useState, useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import ToolActivity from "./ToolActivity";

export default function ChatWindow({ messages, onSend, isStreaming, toolActivity, error }) {
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, toolActivity]);

  function handleSend(e) {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;
    onSend(input.trim());
    setInput("");
  }

  return (
    <div className="chat-window">
      <div className="messages">
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}
        <ToolActivity tools={toolActivity} />
        {error && <div className="error-banner">{error}</div>}
        <div ref={bottomRef} />
      </div>
      <form className="input-row" onSubmit={handleSend}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Ara anything about your chart..."
          disabled={isStreaming}
        />
        <button type="submit" disabled={isStreaming || !input.trim()}>
          {isStreaming ? "..." : "Send"}
        </button>
      </form>
    </div>
  );
}
