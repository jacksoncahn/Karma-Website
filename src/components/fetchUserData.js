//OpenAI
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore'; 

export const fetchData = () => {
  const auth = getAuth();
  const db = getFirestore();

  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('User state changed:', user);  // Debugging line

      if (user) {
        // Get the responses collection
        const responsesCollectionRef = collection(db, 'users', user.uid, 'responses');
        const querySnapshot = await getDocs(responsesCollectionRef);

        if (!querySnapshot.empty) {
          const responses = querySnapshot.docs.map(doc => doc.data());
          const arr = Object.values(responses);  // Return the responses data
          resolve(arr);
        } else {
          resolve(null);
        }
      } else {
        resolve(null);
      }

      unsubscribe(); // Clean up the listener
    });
  });
};
//end OpenAI