import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "ai-scratch-613ce.firebaseapp.com",
  projectId: "ai-scratch-613ce",
  storageBucket: "ai-scratch-613ce.appspot.com",
  messagingSenderId: "791340808475",
  appId: "1:791340808475:web:856f59d424c62a35b6bbbe"
};

const app = initializeApp(firebaseConfig);

export default app;