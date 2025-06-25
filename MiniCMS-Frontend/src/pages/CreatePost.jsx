import React, { useState } from "react";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Tech");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [saving, setSaving] = useState(false);

  const handleImageUpload = async () => {
    return new Promise((resolve) => {
      if (!image) return resolve(null);
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result); // base64 string
      reader.readAsDataURL(image);
    });
  };

  const handleSubmit = async (status) => {
    setSaving(true);
    try {
      const imageUrl = await handleImageUpload();

      const post = {
        id: Date.now(),
        title,
        category,
        tags: tags.split(",").map((tag) => tag.trim()),
        content,
        imageUrl,
        caption,
        status,
        createdAt: new Date().toISOString(),
      };

      const existingPosts = JSON.parse(localStorage.getItem("posts")) || [];
      localStorage.setItem("posts", JSON.stringify([post, ...existingPosts]));

      alert("Post saved locally!");
      setTitle("");
      setCategory("Tech");
      setTags("");
      setContent("");
      setImage(null);
      setCaption("");
    } catch (err) {
      console.error("Error saving post locally:", err);
      alert("Failed to save post");
    }
    setSaving(false);
  };

  return (
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
  );
}
