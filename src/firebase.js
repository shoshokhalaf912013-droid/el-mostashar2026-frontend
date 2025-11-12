// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSy....", // ضع بيانات مشروعك من Firebase Console
  authDomain: "elmoustashar2026.firebaseapp.com",
  projectId: "elmoustashar2026",
  storageBucket: "elmoustashar2026.appspot.com",
  messagingSenderId: "XXXXXXX",
  appId: "1:XXXXXXX:web:XXXXXXX",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
