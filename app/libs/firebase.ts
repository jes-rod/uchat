import { getStorage } from "firebase/storage"
import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: 'uchat-6afe0.appspot.com',
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
  };
  // Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
