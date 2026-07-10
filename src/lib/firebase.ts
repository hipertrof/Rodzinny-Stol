import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "gen-lang-client-0742139252",
  appId: "1:800625620121:web:0603ba3e6884e24ad67408",
  apiKey: "AIzaSyAAbdncFiqFM-ptBuZ2LDWEtjV56oSj29E",
  authDomain: "gen-lang-client-0742139252.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-rodzinnyst-a5712fec-9dca-401b-adec-4592d70cf9d3",
  storageBucket: "gen-lang-client-0742139252.firebasestorage.app",
  messagingSenderId: "800625620121"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore (handling custom database ID)
export const db = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== "(default)"
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);
