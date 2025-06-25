import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { signInWithGoogle } from "./firebase";
import './App.css';
import './index.css';
import LandingPage from "./pages/LandingPage";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import ViewPosts from "./pages/ViewPosts";
import BlogCreation from "./pages/BlogCreation";
import BlogView from "./pages/BlogView";
import ImageUpload from "./pages/ImageUpload";
import SearchFilter from "./pages/SearchFilter";
import ViewImages from "./pages/ViewImages";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<LoginWrapper />} />
        <Route path="/home" element={<Home />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/create-post/:id" element={<CreatePost />} />
        <Route path="/view-posts" element={<ViewPosts />} />
        <Route path="/blog-creation" element={<BlogCreation />} />
        <Route path="/blog-creation/:id" element={<BlogCreation />} />
        <Route path="/blog-view" element={<BlogView />} />
        <Route path="/image-upload" element={<ImageUpload />} />
        <Route path="/view-images" element={<ViewImages />} />
        <Route path="/search-filter" element={<SearchFilter />} />
      </Routes>
    </Router>
  );
}

function LoginWrapper() {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const user = await signInWithGoogle();
      navigate("/home");
    } catch (err) {
      alert("Login failed: " + err.message);
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/home");
      }
    });
  }, [navigate]);

  return <Login onGoogleLogin={handleLogin} />;
}

export default App;
