export default function MessageBubble({ message }) {
  const isUser = message.role === "user";
  return (
    <div className={`bubble-container ${isUser ? "user" : "assistant"}`}>
      <div className={`bubble ${isUser ? "user" : "assistant"}`}>
        {!isUser && <span className="ara-label">Ara ✦</span>}
        <p className={message.streaming ? "streaming" : ""}>{message.content}</p>
      </div>
    </div>
  );
}
