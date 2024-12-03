import OpenAIApi from "openai";
import { apiKeyGPT } from '../../firebaseConfig';

// Add delay function
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const openai = new OpenAIApi({
  apiKey: apiKeyGPT, 
  dangerouslyAllowBrowser: true,
});

export const callChatGPT = async (userInput) => {
  try {
    console.log("Calling ChatGPT API with input:", userInput);
    // Add a small delay before each request (e.g., 1 second)
    await delay(1000); // Delay of 1000ms (1 second)

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",  
      messages: [
        {
          role: "system", 
          content: "you are a bot that helps users determine the morality of specific actions the users give you",
          role: "user",
          content: userInput,
        },
      ],
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error calling ChatGPT API:", error);
    throw error;
  }
};
