
import React from "react";

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { auth, provider } from "../firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";


const Button = ({ children, onClick, className = "" }) => (
  <button
    onClick={onClick}
    className={`px-6 py-2 rounded-md font-semibold shadow-md transition duration-300 ${className}`}
  >
    {children}
  </button>
);



export default function LandingPage() {
  const navigate = useNavigate();

  const handleGoogleSignIn = () => {
      signInWithPopup(auth, provider)
        .then((result) => {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          const user = result.user;
          console.log("Signed in as:", user.displayName);

          // Navigate to home/dashboard after login
          navigate("/home");
        })
        .catch((error) => {
          console.error("Google Sign-In Error:", error);
          const errorCode = error.code;
          const errorMessage = error.message;
          const email = error.customData?.email;
          const credential = GoogleAuthProvider.credentialFromError(error);
          alert("Google Sign-In failed. Please try again.");
  });
  };

  const handleScroll = () => {
    document.getElementById("auth-section").scrollIntoView({ behavior: "smooth" });
  };

  return (
<div className="min-h-screen w-full bg-gradient-to-br from-purple-900 via-blue-600 to-pink-200 text-white overflow-x-hidden">
      {/* Section 1 */}
      <div className="h-screen flex flex-col justify-center items-center px-4 relative">
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-extrabold"
        >
          MiniCMS
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="mt-4 text-xl max-w-xl text-center text-gray-200"
        >
          Lightweight and powerful content management made simple.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <Button
            className="mt-6 bg-yellow-400 text-black hover:bg-yellow-300"
            onClick={handleScroll}
          >
            Get Started
          </Button>
        </motion.div>

      </div>

      {/* Section 2 - Auth Area with glass effect card */}
      <div
        id="auth-section"
        className="h-screen w-full flex justify-center items-center px-4"
      >
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-10 shadow-xl max-w-md w-full text-center"
        >
          <h2 className="text-3xl font-semibold mb-6">Let’s Get You Started</h2>
          <div className="space-y-4">
            <Button
              className="w-full bg-blue-500 hover:bg-blue-400 text-white"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
            <Button
              className="w-full bg-green-500 hover:bg-green-400 text-white"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </Button>
              <Button
                className="w-full bg-red-500 hover:bg-red-400 text-white"
                onClick={handleGoogleSignIn}
              >
                Sign In with Google
              </Button>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
