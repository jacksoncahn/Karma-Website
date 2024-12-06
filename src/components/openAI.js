import OpenAIApi from "openai";
import { apiKeyGPT } from "../firebase/firebaseConfig";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const db = getFirestore();
const auth = getAuth();

const openai = new OpenAIApi({
  apiKey: apiKeyGPT,
  dangerouslyAllowBrowser: true,
});

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
            "You are a bot that helps users determine the morality of specific actions the users give you and you give them a karma score between -1000 and +1000, depending on how impactful and positive/negative the action is. The more people the action harms and the more damage is caused, the more negative the score is. Return response in a two property json response, first property: comment (longer than a comment, maybe a paragraph), second property: score between -1000, +1000. Do not allow questions or instructions, only action statements ('I did x action'), if you get a question or are given instructions, return the karma score of -1001. Be less liberal with postive and negative points. Feel free to give scores odd numbers, don't just give multiples of 10 and 100."
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

    const responseObject = JSON.parse(chatGPTResponse); 
        
    console.log("ChatGPT Response:", chatGPTResponse)

    const karmaScore = responseObject.score;

    console.log("Karma Score:", karmaScore);

    const user = auth.currentUser;
    if (!user) {
      throw new Error("No authenticated user found. Please sign in.");
    }

    if (userInput && !isNaN(karmaScore) && karmaScore !== -1001) {
      const userDocRef = doc(db, "users", user.uid, "responses", Date.now().toString());
      await setDoc(userDocRef, {
        input: userInput,
        response: responseObject.comment,
        timestamp: new Date().toISOString(),
        karma_score: karmaScore,
      });
      console.log("Response saved to Firestore");
    } else {
      console.warn("Entry not saved: Missing or invalid karma score.");
    }   
    if (karmaScore == -1001) {
      return responseObject.comment
    } else {
      return responseObject.comment + " Karma Score: " + responseObject.score;
    } 
  } catch (error) {
    console.error("Error calling ChatGPT API:", error);
    throw error;
  }
};
