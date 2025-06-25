import React, { useState, useRef, useEffect } from "react";
import { db, auth } from "../firebase";
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
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaLink,
  FaListUl,
  FaListOl,
  FaVideo,
  FaFont,
} from "react-icons/fa";
import { onAuthStateChanged } from "firebase/auth";

export default function BlogCreation() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Tech");
  const [tags, setTags] = useState("");
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [language, setLanguage] = useState("English");
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const editorRef = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const existingPost = location.state;

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      }
    });
  }, []);

  useEffect(() => {
    const loadBlog = async () => {
      if (existingPost) {
        prefillFields(existingPost);
      } else if (id) {
        try {
          const docRef = doc(db, "blogs", id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            prefillFields({ id: docSnap.id, ...docSnap.data() });
          } else {
            alert("\u26A0\uFE0F No such blog found in Firestore.");
          }
        } catch (err) {
          console.error("Error loading blog:", err);
        }
      }
    };

    loadBlog();
  }, [id]);

  const prefillFields = (post) => {
    setTitle(post.title || "");
    setCategory(post.category || "Tech");
    setTags(post.tags?.join(", ") || "");
    setCaption(post.caption || "");
    setLanguage(post.language || "English");
    setTimeout(() => {
      if (editorRef.current) editorRef.current.innerHTML = post.content || "";
    }, 0);
  };

  const CLOUD_NAME = "dt5vmndd3";
  const UPLOAD_PRESET = "minicms_upload";

  const handleImageUpload = async () => {
    if (!image) return existingPost?.imageUrl || "";
    if (!(image instanceof File)) {
      throw new Error("\u274C Invalid image file");
    }
    try {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", UPLOAD_PRESET);
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        formData
      );
      return res.data.secure_url;
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("Image upload failed.");
      return null;
    }
  };

  const handleVideoUpload = async () => {
    if (!video) return existingPost?.videoUrl || "";
    const formData = new FormData();
    formData.append("file", video);
    formData.append("upload_preset", UPLOAD_PRESET);
    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`,
        formData
      );
      return res.data.secure_url;
    } catch (err) {
      console.error("Video upload failed:", err);
      throw new Error("Video upload failed");
    }
  };

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  const insertVideo = () => {
    const url = prompt("Enter video URL");
    if (url) {
      const videoHTML = `<video controls width="400"><source src="${url}" type="video/mp4"></video>`;
      execCommand("insertHTML", videoHTML);
    }
  };

  const handleSubmit = async (status) => {
    setSaving(true);
    try {
      const imageUrl = await handleImageUpload();
      const videoUrl = await handleVideoUpload();
      const content = editorRef.current.innerHTML;

      const postData = {
        title: title.trim(),
        category,
        tags: tags ? tags.split(",").map((t) => t.trim()) : [],
        caption: caption.trim(),
        imageUrl,
        videoUrl,
        author: user?.displayName || "",
        authorImg: user?.photoURL || "",
        language,
        content,
        status,
        updatedAt: serverTimestamp(),
      };

      if (id) {
        const postRef = doc(db, "blogs", id);
        const postSnap = await getDoc(postRef);
        if (postSnap.exists()) {
          await updateDoc(postRef, postData);
          alert("Post updated!");
        } else {
          alert("Cannot update. Post not found.");
        }
      } else {
        const docRef = await addDoc(collection(db, "blogs"), {
          ...postData,
          createdAt: serverTimestamp(),
        });
        alert("\u2705 Post published!");
        navigate(`/blog-creation/${docRef.id}`, {
          state: { ...postData, id: docRef.id },
        });
      }
    } catch (error) {
      console.error("Error saving post:", error);
      alert("Failed to save post.");
    }
    setSaving(false);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-800 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-6 bg-gray-300 shadow rounded mt-6">
          <h2 className="text-3xl font-bold mb-6">
            {existingPost || id ? "Update Blog Post" : "Create New Blog Post"}
          </h2>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Post Title"
              className="w-full p-2 border rounded"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <div className="flex flex-col md:flex-row gap-4">
              <select
                className="p-2 border rounded"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Tech">Tech</option>
                <option value="News">News</option>
                <option value="Tutorial">Tutorial</option>
              </select>

              <select
                className="p-2 border rounded"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option>English</option>
                <option>Hindi</option>
                <option>Marathi</option>
              </select>

              <input
                type="text"
                placeholder="Tags (comma-separated)"
                className="w-full p-2 border rounded"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>

            <div>
              <label className="block font-medium mb-2">Content</label>
              <div className="flex flex-wrap gap-2 mb-2">
                <button onClick={() => execCommand("bold")} className="p-2 border rounded hover:bg-gray-100"><FaBold /></button>
                <button onClick={() => execCommand("italic")} className="p-2 border rounded hover:bg-gray-100"><FaItalic /></button>
                <button onClick={() => execCommand("underline")} className="p-2 border rounded hover:bg-gray-100"><FaUnderline /></button>
                <button onClick={() => execCommand("insertUnorderedList")} className="p-2 border rounded hover:bg-gray-100"><FaListUl /></button>
                <button onClick={() => execCommand("insertOrderedList")} className="p-2 border rounded hover:bg-gray-100"><FaListOl /></button>
                <button onClick={() => execCommand("createLink", prompt("Enter URL:"))} className="p-2 border rounded hover:bg-gray-100"><FaLink /></button>
                <button onClick={() => execCommand("fontSize", 4)} className="p-2 border rounded hover:bg-gray-100"><FaFont /></button>
                <button onClick={insertVideo} className="p-2 border rounded hover:bg-gray-100"><FaVideo /></button>
              </div>
              <div
                ref={editorRef}
                contentEditable
                className="w-full p-4 border rounded min-h-[200px] focus:outline-none"
              ></div>
            </div>

            <div className="border p-4 rounded bg-gray-250">
              <label className="block font-medium mb-2">Upload Image</label>
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                className="p-1 mb-2 border bg-blue-200 rounded"
              />
              <input
                type="text"
                placeholder="Caption"
                className="w-full p-2 border rounded"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
            </div>

            <div className="border p-4 rounded bg-gray-250">
              <label className="block font-medium mb-2">Upload Video</label>
              <input
                type="file"
                onChange={(e) => setVideo(e.target.files[0])}
                className="p-1 mb-2 border bg-blue-200 rounded"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => handleSubmit("draft")}
                disabled={saving}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              >
                Save as Draft
              </button>
              <button
                type="button"
                onClick={() => handleSubmit("published")}
                disabled={saving}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                {existingPost || id ? "Update Post" : "Publish Post"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
