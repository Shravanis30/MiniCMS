// // src/firebase.js
// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: "YOUR_API_KEY",
//   authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
//   projectId: "YOUR_PROJECT_ID",
//   storageBucket: "YOUR_PROJECT_ID.appspot.com",
//   messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
//   appId: "YOUR_APP_ID"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// export const auth = getAuth(app);
// export const db = getFirestore(app);

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBl1dCWiulmD9qL_UwWSCMchmKBtn_C_GI",
  authDomain: "minicms-3820a.firebaseapp.com",
  projectId: "minicms-3820a",
  storageBucket: "minicms-3820a.firebasestorage.app",
  messagingSenderId: "84515894111",
  appId: "1:84515894111:web:88e869602454f4c95dbcea",
  measurementId: "G-62LF2NPPT5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// const analytics = getAnalytics(app);
