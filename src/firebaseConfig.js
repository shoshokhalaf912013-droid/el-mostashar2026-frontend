// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyByOJ1hF6GIa5lEMSoxYAAi99L3v0G6EtU",
  authDomain: "almustashar-2026.firebaseapp.com",
  projectId: "almustashar-2026",
  storageBucket: "almustashar-2026.firebasestorage.app",
  messagingSenderId: "564186071401",
  appId: "1:564186071401:web:4ca76cccbd7c76cb05bdf8",
  measurementId: "G-NG4E6FZBLN"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
