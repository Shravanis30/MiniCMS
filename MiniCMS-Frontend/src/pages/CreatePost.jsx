
import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Sidebar from "../components/Sidebar";
import axios from "axios";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Tech");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [saving, setSaving] = useState(false);

  const handleImageUpload = async () => {
    if (!image) return null;

    const formData = new FormData();
    formData.append("image", image);

    try {
      const res = await axios.post("http://localhost:5000/upload", formData);
      return res.data.imageUrl;
    } catch (error) {
      console.error("Image upload failed:", error);
      return null;
    }
  };

  const handleSubmit = async (status) => {
    setSaving(true);
    try {
      const imageUrl = await handleImageUpload();
      const postId = Date.now().toString();

      await addDoc(collection(db, "posts"), {
        id: postId,
        title,
        category,
        tags: tags.split(",").map(tag => tag.trim()),
        content,
        caption,
        imageUrl,
        status,
        createdAt: serverTimestamp(),
      });

      alert("✅ Post saved!");
      setTitle("");
      setCategory("Tech");
      setTags("");
      setContent("");
      setImage(null);
      setCaption("");
    } catch (error) {
      console.error("❌ Error saving post:", error);
      alert("Failed to save post.");
    }
    setSaving(false);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded mt-6">
          <h2 className="text-3xl font-bold mb-6">Create New Post</h2>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Post Title"
              className="w-full p-2 border rounded"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <div className="flex gap-4">
              <select
                className="p-2 border rounded"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
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
              className="w-full p-4 border rounded min-h-[200px]"
              placeholder="Write your post content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            <div className="border p-4 rounded bg-gray-50">
              <label className="block font-medium mb-2">Upload Image</label>
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                className="mb-2"
              />
              <input
                type="text"
                placeholder="Caption"
                className="w-full p-2 border rounded"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
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
                Publish Post
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

