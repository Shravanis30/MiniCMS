import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBl1dCWiulmD9qL_UwWSCMchmKBtn_C_GI",
  authDomain: "minicms-3820a.firebaseapp.com",
  projectId: "minicms-3820a",
  storageBucket: "minicms-3820a.firebasestorage.app",
  messagingSenderId: "84515894111",
  appId: "1:84515894111:web:88e869602454f4c95dbcea",
  measurementId: "G-62LF2NPPT5"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// Sign in with Google popup method
const signInWithGoogle = async () => {
  try {
    await setPersistence(auth, browserLocalPersistence);
    const result = await signInWithPopup(auth, provider);
    console.log("Google Sign-in Success:", result.user);
    return result.user;
  } catch (error) {
    console.error("Google Sign-in Error:", error.code, error.message);
    throw error;
  }
};

const logout = async () => {
  try {
    await auth.signOut();
    console.log("User signed out");
  } catch (err) {
    console.error("Sign out error:", err.message);
  }
};

// ✅ Export all
export { app, auth, db, provider, signInWithGoogle, logout };
