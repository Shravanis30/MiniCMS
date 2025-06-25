import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getAuth } from "firebase/auth";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Tech");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [saving, setSaving] = useState(false);

  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const existingPost = location.state;

  const [author, setAuthor] = useState("");
  const [authorImg, setAuthorImg] = useState("");

  const CLOUD_NAME = "dt5vmndd3";
  const UPLOAD_PRESET = "minicms_upload";

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setAuthor(user.displayName);
      setAuthorImg(user.photoURL);
    }

    const loadPost = async () => {
      if (existingPost) {
        prefillFields(existingPost);
      } else if (id) {
        const docRef = doc(db, "posts", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          prefillFields({ id: docSnap.id, ...docSnap.data() });
        }
      }
    };
    loadPost();
  }, [id]);

  const prefillFields = (post) => {
    setTitle(post.title || "");
    setCategory(post.category || "Tech");
    setTags(post.tags?.join(", ") || "");
    setContent(post.content || "");
    setCaption(post.caption || "");
  };

  const handleImageUpload = async () => {
    if (!image) return existingPost?.imageUrl || "";
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", UPLOAD_PRESET);
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      formData
    );
    return res.data.secure_url;
  };

  const handleSubmit = async (status) => {
    if (!title || !content) {
      alert("Title and content are required.");
      return;
    }

    setSaving(true);
    try {
      const imageUrl = await handleImageUpload();
      const postData = {
        title,
        category,
        tags: tags.split(",").map((tag) => tag.trim()),
        content,
        caption,
        imageUrl,
        author,
        authorImg,
        status,
        createdAt: serverTimestamp(),
      };

      if (id) {
        await updateDoc(doc(db, "posts", id), postData);
        alert("✅ Post updated!");
      } else {
        await addDoc(collection(db, "posts"), postData);
        alert("✅ Post created!");
      }

      navigate("/view-posts");
    } catch (error) {
      console.error("Error saving post:", error);
      alert("Failed to save post.");
    }
    setSaving(false);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-800">
        <div className="max-w-5xl mx-auto p-6 bg-gray-300 shadow rounded mt-6">
          <h2 className="text-3xl font-bold mb-6">{id ? "Edit" : "Create"} Post</h2>
          <input
            type="text"
            placeholder="Title"
            className="w-full p-2 border rounded mb-4"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="flex gap-4 mb-4">
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="p-2 border rounded">
              <option value="Tech">Tech</option>
              <option value="News">News</option>
              <option value="Tutorial">Tutorial</option>
            </select>
            <input
              type="text"
              placeholder="Tags (comma-separated)"
              className="w-full p-2 border rounded"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
          <textarea
            className="w-full p-4 border rounded mb-4 min-h-[200px]"
            placeholder="Write your post content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="mb-4">
            <input type="file" 
            onChange={(e) => 
            setImage(e.target.files[0])}                
            className="p-1 mb-2 border bg-blue-200 rounded" 
          />
            <input
              type="text"
              placeholder="Image Caption"
              className="w-full p-2 border rounded"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => handleSubmit("draft")}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            >
              Save as Draft
            </button>
            <button
              onClick={() => handleSubmit("published")}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Publish
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

