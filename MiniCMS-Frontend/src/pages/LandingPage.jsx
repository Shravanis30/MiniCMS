import React from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex flex-col items-center justify-center text-gray-800">
      <h1 className="text-5xl font-bold mb-6">MiniCMS</h1>
      <div className="space-x-4">
        <Link to="/login" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
          Login
        </Link>
        <Link to="/signup" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
          Sign Up
        </Link>
      </div>
    </div>
  );
}