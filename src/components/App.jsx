import { useState } from "react";
import { debounce } from "lodash"; // Import debounce from lodash
import "./App.css";
import ActionEntry from "./Entry.jsx";
import { SignIn, SignOut } from "./auth"
import { useAuthentication } from "../services/authService"
import { callChatGPT } from "./openAI.js";
import { saveResponseToFirestore } from "../firebase/firebaseUtils.js"; // Import save function


function App() {
  const [response, setResponse] = useState("");
  const user = useAuthentication()


  // Create a debounced version of the callChatGPT function
  const debouncedCallChatGPT = debounce(async (userInput) => {
    console.log("API request made for:", userInput); // Debug log
    try {
      const chatResponse = await callChatGPT(userInput);
      setResponse(chatResponse);


      // Save the response to Firestore
      await saveResponseToFirestore(userInput, chatResponse);
    } catch (error) {
      console.error("Error communicating with ChatGPT:", error);
    }
  }, 3000); // 3000ms (3-second) delay between requests


  const handleAction = (userInput) => {
    console.log("User input received:", userInput); // Debug log
    debouncedCallChatGPT(userInput);
  };


  return (
    <>
    <header>
        {!user ? <SignIn /> : <SignOut />}
      </header>
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
