import { useState, useEffect } from "react";
import { debounce } from "lodash";
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
        setData(fetched.reverse());
    };

    fetchUserData();
    const intervalId = setInterval(fetchUserData, 1000);
  
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const totalScore = async () => {
      const scores = await fetchData();
      const scoreTotal = scores.map(item => item.karma_score).filter(karma_score => typeof(karma_score) === 'number').reduce((sum, karma_score) => sum + karma_score, 0);
      setTotal(scoreTotal);
    }

      totalScore();

    const intervalId2 = setInterval(totalScore, 1000);
    return () => clearInterval(intervalId2);
  }, []);

  const debouncedCallChatGPT = debounce(async (userInput) => {
    console.log("API request made for:", userInput);
    try {
      const chatResponse = await callChatGPT(userInput);
      setResponse(chatResponse);

    } catch (error) {
      console.error("Error communicating with ChatGPT:", error);
    } finally {
      setIsLoading(false);
    }
  }, 3000);

  const handleAction = (userInput) => {
    console.log("User input received:", userInput);

    const audio = new Audio(loadingSound);
    if (user) {
      audio.play();
      setIsLoading(true);
    debouncedCallChatGPT(userInput);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
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
        {user? isLoading ? (
          <div className="loading">
            <img src={loadingImage} alt="Loading..." className="rotating-image" />
          </div>
        ) : response ? (
          <>
            <h3>Evaluation:</h3>
            <p>{response}</p>
          </>
        ) : null: null}
      </div>
      <div className = "database">
        {user? <h1 className = "total">Karma Total: {total}</h1>: <p>Sign in to see karma score</p>}
        {data? data.map(item => (item.input?
        <div key={item.id}>
          <h2 className = "action">{item.input}</h2>
          <p className = "responsetxt">{item.response}</p>
          <h3>Karma Score: {item.karma_score}</h3>
          <p>{formatTimestamp(item.timestamp)}</p>
        </div>: "")) : null}
      </div>
    </>
  );
}

export default App;
