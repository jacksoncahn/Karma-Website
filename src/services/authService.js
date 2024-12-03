import { useState, useEffect } from "react";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

export function login() {
  return signInWithPopup(auth, new GoogleAuthProvider());
}


export function logout() {
  return signOut(auth);
}

export function loggedInUserDisplayName() {
  return auth.currentUser ? auth.currentUser.displayName : null; 
}

export function useAuthentication() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user); 
    });

    return () => unsubscribe();
  }, []);

  return user;
}
