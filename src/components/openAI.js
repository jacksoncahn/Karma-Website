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
    // Add a small delay before each request (e.g., 1 second)
    await delay(1000); // Delay of 1000ms (1 second)

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",  // Use the correct model
      messages: [
        {
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
