import { useState, useEffect } from "react";
import { debounce } from "lodash"; // Import debounce from lodash
import "./App.css";
import ActionEntry from "./Entry.jsx";
import { SignIn, SignOut } from "./auth";
import { useAuthentication } from "../services/authService";
import { callChatGPT } from "./openAI.js";
import {fetchData} from "./fetchUserData.js";
import loadingImage from "/loading.png"
import loadingSound from "/loading-sound.mp3"

function App() {
  const [response, setResponse] = useState("");
  const user = useAuthentication()
  const [data, setData] = useState("");
  const [total, setTotal] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
        const fetched = await fetchData(); 
        setData(fetched);  // Ensure fetched data is set correctly
    };
  
    // Initial fetch
    fetchUserData();
  
    // Polling every few seconds
    const intervalId = setInterval(fetchUserData, 1000); // Fetch every 5 seconds
  
    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []);

  useEffect(() => {
    const totalScore = async () => {
      const scores = await fetchData();
      const scoreTotal = scores.map(item => item.karma_score).filter(karma_score => typeof(karma_score) === 'number').reduce((sum, karma_score) => sum + karma_score, 0);
      setTotal(scoreTotal);
    }
  
    // Initial fetch

      totalScore();
  
    // Polling every few seconds
    const intervalId2 = setInterval(totalScore, 1000); // Fetch every 5 seconds
  
    return () => clearInterval(intervalId2); // Cleanup interval on unmount
  }, []);

  // Debounced version of the API call
  const debouncedCallChatGPT = debounce(async (userInput) => {
    console.log("API request made for:", userInput);
    try {
      const chatResponse = await callChatGPT(userInput);
      setResponse(chatResponse);

      // Save the response to Firestore
      // await saveResponseToFirestore(userInput, chatResponse);
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
      
      <ActionEntry className = "entry" action={handleAction} />
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
      <div className = "database">
        <h1>{user? total: null}</h1>
        {data? data.map(item => (
          item.input?
        <div key={item.id}>
          <p className = "action">{item.input}</p>
          <p className = "responsetxt">{item.response}</p>
          <p>Karma Score {item.karma_score}</p>          
        </div>: ""
      )) : null}
      </div>
    </>
  );
}

export default App;
