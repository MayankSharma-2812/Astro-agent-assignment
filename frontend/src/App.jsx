import { useState, useEffect } from "react";
import BirthForm from "./components/BirthForm";
import ChatWindow from "./components/ChatWindow";
import { useChat } from "./hooks/useChat";
import { getSessionId } from "./utils/session";

export default function App() {
  const [birthDetails, setBirthDetails] = useState(null);
  const [stage, setStage] = useState("form"); // 'form' | 'chat'
  const { messages, sendMessage, isStreaming, toolActivity, error } = useChat();

  // On load, check if session has existing history
  useEffect(() => {
    const sessionId = getSessionId();
    const apiUrl = import.meta.env.VITE_API_URL || "";
    fetch(`${apiUrl}/history/${sessionId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.chartData) {
          setBirthDetails(data.chartData.birthDetails);
          setStage("chat");
        }
      })
      .catch(() => {}); // silently fail — session may not exist yet
  }, []);

  function handleBirthSubmit(details) {
    setBirthDetails(details);
    setStage("chat");
    sendMessage(`Hi, I just shared my birth details. My name is ${details.name}.`, details);
  }

  return (
    <div className="app">
      <header>
        <h1>✦ Aradhana</h1>
        <p>Your daily spiritual companion</p>
      </header>
      <main>
        {stage === "form" ? (
          <BirthForm onSubmit={handleBirthSubmit} />
        ) : (
          <ChatWindow
            messages={messages}
            onSend={(msg) => sendMessage(msg)}
            isStreaming={isStreaming}
            toolActivity={toolActivity}
            error={error}
          />
        )}
      </main>
    </div>
  );
}
