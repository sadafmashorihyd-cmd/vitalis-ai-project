// 1. Zaroori Firebase Tools Import Karein
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// 2. Aapki Asli Keys (Jo aapne abhi Firebase Console se li hain)
const firebaseConfig = {
  apiKey: "AIzaSyC9nmi_jY80QjBd7ndjp1w7H6HLZiibDeI",
  authDomain: "vitalis-app-17219.firebaseapp.com",
  projectId: "vitalis-app-17219",
  storageBucket: "vitalis-app-17219.firebasestorage.app",
  messagingSenderId: "979552494424",
  appId: "1:979552494424:web:c8c868a36e96c52ac9bb2d",
  measurementId: "G-WHXJGTRLJR"
};

// 3. Firebase ko Initialize karein
const app = initializeApp(firebaseConfig);

// 4. In Services ko Export karein taake App.js inhein use kar sake
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);