import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { getAuth } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export default function ImageUpload() {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({ name: "", photo: "" });
  const [collapsed, setCollapsed] = useState(false);

  const CLOUD_NAME = "dt5vmndd3";
  const UPLOAD_PRESET = "minicms_upload";

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser({
        name: currentUser.displayName || "Unknown User",
        photo: currentUser.photoURL || "",
      });
    }
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!image) return alert("Please select an image.");

    setLoading(true);
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        formData
      );

      const secureUrl = response.data.secure_url;

      await addDoc(collection(db, "images"), {
        imageUrl: secureUrl,
        authorName: user.name,
        authorImg: user.photo,
        uploadedAt: serverTimestamp(),
      });

      alert("✅ Image uploaded & saved to Firestore!");
      setImage(null);
      setPreviewUrl("");
    } catch (err) {
      console.error("Upload error:", err);
      alert("❌ Image upload failed.");
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main className="flex-1 px-4 py-6 sm:px-6 bg-gray-800 overflow-y-auto transition-all duration-300">
        <div className="max-w-2xl mx-auto bg-gray-300 p-4 sm:p-6 rounded shadow">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Upload Image</h2>

          <div className="flex flex-col gap-4">
            <input
              type="file"
              onChange={handleFileChange}
              className="p-2 border bg-blue-200 rounded w-full text-sm sm:text-base"
            />

            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full max-h-[300px] object-contain rounded"
              />
            )}

            <button
              onClick={handleUpload}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 w-full sm:w-auto"
            >
              {loading ? "Uploading..." : "Upload Image"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}