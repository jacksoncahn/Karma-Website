import OpenAIApi from "openai";
import { apiKeyGPT } from "../firebase/firebaseConfig";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const db = getFirestore();
const auth = getAuth();

const openai = new OpenAIApi({
  apiKey: apiKeyGPT,
  dangerouslyAllowBrowser:true,
})

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const callChatGPT = async (userInput) => {
  try {
    console.log("Calling ChatGPT API with input:", userInput);

    await delay(1000);

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a bot that helps users determine the morality of specific actions the users give you and you give them a karma score between -100 and 100, depending on how impactful and positive/negative the action is",
        },
        {
          role: "user",
          content: userInput,
        },
      ],
    });

    const chatGPTResponse =
      response.choices && response.choices.length > 0
        ? response.choices[0].message.content
        : "No response available";

    console.log("ChatGPT Response:", chatGPTResponse);

    const user = auth.currentUser;
    if (!user) {
      throw new Error("No authenticated user found. Please sign in.");
    }

    const userDocRef = doc(db, "users", user.uid, "responses", Date.now().toString());
    await setDoc(userDocRef, {
      input: userInput,
      response: chatGPTResponse,
      timestamp: new Date().toISOString(),
    });

    console.log("Response saved to Firestore");

    return chatGPTResponse;
  } catch (error) {
    console.error("Error calling ChatGPT API:", error);
    throw error;
  }
};
