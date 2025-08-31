// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCS8QywZviACAArM2jO-zApLOjNIubTvA8",
  authDomain: "gym-project-476ea.firebaseapp.com",
  projectId: "gym-project-476ea",
  storageBucket: "gym-project-476ea.appspot.com",
  messagingSenderId: "250813626027",
  appId: "1:250813626027:web:69536ec85adfa78bfea9ee",
  databaseURL:"https://gym-project-476ea-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore Database
export const db = getFirestore(app);
export const auth = getAuth(app);
