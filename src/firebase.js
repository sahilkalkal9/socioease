// firebase.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore'; // Add other Firebase services you need here

// Replace the config object with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Create a Firebase context
const FirebaseContext = createContext();

// Custom hook to access the Firebase context
export const useFirebase = () => {
  return useContext(FirebaseContext);
};

// Firebase context provider
export const FirebaseProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [db, setDb] = useState(null);

  useEffect(() => {
    // Set up Firebase services here
    const auth = firebase.auth();
    const firestore = firebase.firestore();
    // Add other Firebase services you need here

    setAuth(auth);
    setDb(firestore);

    // Clean up the Firebase services on unmount (optional)
    return () => {
      // Clean up the services here if needed
    };
  }, []);

  return (
    <FirebaseContext.Provider value={{ auth, db }}>
      {children}
    </FirebaseContext.Provider>
  );
};
