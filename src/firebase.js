// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Paste your exact configuration object keys from your Firebase dashboard below
const firebaseConfig = {
  apiKey: "AIzaSyAK_IBgDgaMsT7cz3TMGBM65KMLCZ6HjDo",
  authDomain: "buildconnect-recruitment.firebaseapp.com",
  projectId: "buildconnect-recruitment",
  storageBucket: "buildconnect-recruitment.firebasestorage.app",
  messagingSenderId: "1016829882361",
  appId: "1:1016829882361:web:b626bc46485fe834955728",
  measurementId: "G-NNHG3LKDKY"
};

// Initialize Firebase services
const app = initializeApp(firebaseConfig);

// Export instances to use them in our components
export const auth = getAuth(app);
export const db = getFirestore(app);