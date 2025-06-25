import React, { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";import './App.css'
import './index.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import EditPost from "./pages/EditPost";
import AddPost from "./pages/AddPost";
import { signInWithGoogle } from "./firebase.js"; // adjust path accordingly
import { useNavigate } from "react-router-dom";
import CreatePost from "./pages/CreatePost.jsx";

function App() {

  const handleLogin = async () => {
    try {
      const user = await signInWithGoogle();
      navigate("/home"); // redirect after successful login
    } catch (err) {
      alert("Login failed: " + err.message);
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />      
        <Route path="/editPost" element={<EditPost />} />      
        <Route path="/addPost" element={<AddPost />} />      
        <Route path="/create-post" element={<CreatePost />} />      
      </Routes>
    </Router>
  )
}

export default App
