import { useState } from "react";
import "./App.css";
import ActionEntry from "./Entry.jsx";
import { callChatGPT } from "./openAI.js";

function App() {
  const [response, setResponse] = useState("");

  const handleAction = async (userInput) => {
    try {
      const chatResponse = await callChatGPT(userInput);
      setResponse(chatResponse);
    } catch (error) {
      console.error("Error communicating with ChatGPT:", error);
    }
  };

  return (
    <>
      <h1 className="title">Karma Kalculator</h1>
      <p className="motto">We strive for excellence</p>
      <ActionEntry action={handleAction} />
      {response && (
        <div className="response">
          <h3>ChatGPT's Response:</h3>
          <p>{response}</p>
        </div>
      )}
    </>
  );
}

export default App;
