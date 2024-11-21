import OpenAIApi from "openai";
import { apiKeyGPT } from '../../firebaseConfig';

const openai = new OpenAIApi({
  apiKey: apiKeyGPT, 
});

export const callChatGPT = async (userInput) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
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
