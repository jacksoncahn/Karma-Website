import { useState } from "react";
import { debounce } from "lodash"; // Import debounce from lodash
import "./App.css";
import ActionEntry from "./Entry.jsx";
import { SignIn, SignOut } from "./auth";
import { useAuthentication } from "../services/authService";
import { callChatGPT } from "./openAI.js";
import { saveResponseToFirestore } from "../firebase/firebaseUtils.js"; // Import save function
import loadingGif from "./loading.gif"; // Import your loading GIF

function App() {
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false); // State to track loading
  const user = useAuthentication();

  // Debounced version of the API call
  const debouncedCallChatGPT = debounce(async (userInput) => {
    console.log("API request made for:", userInput); // Debug log
    try {
      const chatResponse = await callChatGPT(userInput);
      setResponse(chatResponse);

      // Save the response to Firestore
      await saveResponseToFirestore(userInput, chatResponse);
    } catch (error) {
      console.error("Error communicating with ChatGPT:", error);
    } finally {
      setIsLoading(false); // End loading after the API call
    }
  }, 3000); // 3000ms (3-second) delay

  const handleAction = (userInput) => {
    console.log("User input received:", userInput); // Debug log
    setIsLoading(true); // Start loading immediately when the action is triggered
    debouncedCallChatGPT(userInput);
  };

  return (
    <>
      <header className="signinout">
        {!user ? <SignIn /> : <SignOut />}
      </header>
      <div className="title">
        <h1 className="name">Karma Kalculator</h1>
        <p className="motto">We strive for excellence</p>
      </div>
      <div className="entry-container">
        {isLoading && (
          <div className="loading">
            <img src={loadingGif} alt="Loading..." />
          </div>
        )}
        <ActionEntry className="entry" action={handleAction} />
      </div>
      {response && !isLoading && (
        <div className="response">
          <h3>Evaluation:</h3>
          <p>{response}</p>
        </div>
      )}
    </>
  );
}

export default App;
