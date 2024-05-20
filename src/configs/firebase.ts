// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBUHoXnM9DqP5CqXSX1HWBBMfB4m4YfVHM",
  authDomain: "my-blog-2261c.firebaseapp.com",
  projectId: "my-blog-2261c",
  storageBucket: "my-blog-2261c.appspot.com",
  messagingSenderId: "489947512386",
  appId: "1:489947512386:web:62b51667a75e67b57377db",
  measurementId: "G-ZKBNY1CL8D",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const googleProvider = new GoogleAuthProvider();
const auth = getAuth();
const db = getFirestore(app);

export { app, analytics, googleProvider, auth, db };
