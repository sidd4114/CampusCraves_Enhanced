import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Firestore
import { signOut as firebaseSignOut } from "firebase/auth"; // for signing out . it is a function


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDiwn4IaPeqnMA7RbsrVeAcG2XgkRisBYU",
  authDomain: "campuscraves-43579.firebaseapp.com",
  projectId: "campuscraves-43579",
  storageBucket: "campuscraves-43579.firebasestorage.app",
  messagingSenderId: "299158557182",
  appId: "1:299158557182:web:9ebddcc2357dea19dfb0af",
  measurementId: "G-968JV8BZ3F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore

// Set persistence to local to retain the session across page reloads
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    // Session persistence has been set to local storage
  })
  .catch((error) => {
    console.error("Error setting persistence: ", error);
  });

// Export modules
export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, db,firebaseSignOut  }; 