import { db } from './firebaseConfig';
import { collection, doc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export const saveResponseToFirestore = async (userInput, chatResponse) => {
  const auth = getAuth();
  
  // Wait for authentication state to be confirmed
  const user = auth.currentUser;

  // Ensure the user is authenticated before attempting to save the response
  if (!user) {
    console.error("User not authenticated. Please sign in first.");
    return;
  }

  const userId = user.uid;
  const timestamp = new Date();
  const responseId = `${timestamp.getTime()}`; // Unique ID based on timestamp

  try {
    // Reference the user's specific responses collection
    const docRef = doc(collection(db, `users/${userId}/responses`), responseId);

    // Save the response data to Firestore
    await setDoc(docRef, {
      userInput,
      response: chatResponse,
      timestamp,
    });

    console.log("Response saved to Firestore under user-specific collection.");
  } catch (error) {
    console.error("Error saving response to Firestore:", error);
  }
};
