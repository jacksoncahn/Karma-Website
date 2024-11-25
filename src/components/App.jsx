import { useState } from "react";
import { debounce } from "lodash";  // Import debounce from lodash
import "./App.css";
import ActionEntry from "./Entry.jsx";
import { callChatGPT } from "./openAI.js";

function App() {
  const [response, setResponse] = useState("");

  // Create a debounced version of the callChatGPT function
  const debouncedCallChatGPT = debounce(async (userInput) => {
    console.log('API request made for:', userInput);  // Debug log
    try {
      const chatResponse = await callChatGPT(userInput);
      setResponse(chatResponse);
    } catch (error) {
      console.error("Error communicating with ChatGPT:", error);
    }
  }, 1000); // 1000ms (1 second) delay between requests

  const handleAction = (userInput) => {
    console.log('User input received:', userInput);  // Debug log
    debouncedCallChatGPT(userInput);
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
