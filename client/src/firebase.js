// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "myestate-34557.firebaseapp.com",
  projectId: "myestate-34557",
  storageBucket: "myestate-34557.appspot.com",
  messagingSenderId: "377213567799",
  appId: "1:377213567799:web:d8434b75fde0def82150b2"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);