import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAnDfoXDvRpLzvBkveTyOQwFSB7dTeqSes",
  authDomain: "chat-app-430f6.firebaseapp.com",
  projectId: "chat-app-430f6",
  storageBucket: "chat-app-430f6.appspot.com",
  messagingSenderId: "136671443777",
  appId: "1:136671443777:web:49b6fe107cc3bb67fa7fc0",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore(app);
