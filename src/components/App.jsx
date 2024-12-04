import { useState } from "react";
import { debounce } from "lodash";
import "./App.css";
import ActionEntry from "./Entry.jsx";
import { SignIn, SignOut } from "./auth";
import { useAuthentication } from "../services/authService";
import { callChatGPT } from "./openAI.js";
import { saveResponseToFirestore } from "../firebase/firebaseUtils.js";
import loadingImage from "./loading.png"; // Static loading image
import loadingSound from "./loading-sound.mp3"; // Import sound effect

function App() {
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const user = useAuthentication();

  // Debounced version of the API call
  const debouncedCallChatGPT = debounce(async (userInput) => {
    console.log("API request made for:", userInput);
    try {
      const chatResponse = await callChatGPT(userInput);
      setResponse(chatResponse);

      // Save the response to Firestore
      await saveResponseToFirestore(userInput, chatResponse);
    } catch (error) {
      console.error("Error communicating with ChatGPT:", error);
    } finally {
      setIsLoading(false);
    }
  }, 3000);

  const handleAction = (userInput) => {
    console.log("User input received:", userInput);

    // Play the sound effect
    const audio = new Audio(loadingSound); // Create a new Audio object
    audio.play(); // Play the sound

    setIsLoading(true); // Start loading
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
        <ActionEntry className="entry" action={handleAction} />
      </div>
      <div className="response">
        {isLoading ? (
          <div className="loading">
            <img src={loadingImage} alt="Loading..." className="rotating-image" />
          </div>
        ) : response ? (
          <>
            <h3>Evaluation:</h3>
            <p>{response}</p>
          </>
        ) : null}
      </div>
    </>
  );
}

export default App;
