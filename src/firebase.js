import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCWu0hinE9rw4z_YpArMiClrNkqDnuLVlE",
  authDomain: "madanlal-sarees.firebaseapp.com",
  projectId: "madanlal-sarees",
  storageBucket: "madanlal-sarees.firebasestorage.app",
  messagingSenderId: "823593542032",
  appId: "1:823593542032:web:269e73e1e1851bce4bd315"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// Only this email is treated as admin (the real lock is in Firestore rules)
export const ADMIN_EMAIL = "rishabhsinghal2021@gmail.com";