import OpenAIApi from "openai";
import { apiKeyGPT } from "../firebase/firebaseConfig";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firestore and Auth setup
const db = getFirestore();
const auth = getAuth();

// Initialize OpenAI API client
const openai = new OpenAIApi({
  apiKey: apiKeyGPT,
  dangerouslyAllowBrowser:true,
})

// Add delay function
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const callChatGPT = async (userInput) => {
  try {
    console.log("Calling ChatGPT API with input:", userInput);

    // Add a small delay before each request (e.g., 1 second)
    await delay(1000); // Delay of 1000ms (1 second)

    // Make the API request to OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a bot that helps users determine the morality of specific actions the users give you and you give them a karma score from 1-10",
        },
        {
          role: "user",
          content: userInput,
        },
      ],
    });

    // Extract the response content
    const chatGPTResponse =
      response.choices && response.choices.length > 0
        ? response.choices[0].message.content
        : "No response available";

    console.log("ChatGPT Response:", chatGPTResponse);

    // Get the currently authenticated user
    const user = auth.currentUser;
    if (!user) {
      throw new Error("No authenticated user found. Please sign in.");
    }

    // Save response to Firestore
    const userDocRef = doc(db, "users", user.uid, "responses", Date.now().toString());
    await setDoc(userDocRef, {
      input: userInput,
      response: chatGPTResponse,
      timestamp: new Date().toISOString(),
    });

    console.log("Response saved to Firestore");

    // Return the response
    return chatGPTResponse;
  } catch (error) {
    console.error("Error calling ChatGPT API:", error);
    throw error;
  }
};
