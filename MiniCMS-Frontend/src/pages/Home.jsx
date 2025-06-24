
// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";

export default function Home() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    const snapshot = await getDocs(collection(db, "posts"));
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setPosts(data);
  };

  const handleAdd = async () => {
    if (!title || !content) return;
    await addDoc(collection(db, "posts"), { title, content });
    setTitle("");
    setContent("");
    fetchPosts();
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "posts", id));
    fetchPosts();
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Manage Blog Posts</h1>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Title"
          className="border p-2 mr-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Content"
          className="border p-2 mr-2 rounded"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button onClick={handleAdd} className="bg-green-600 text-white px-4 py-2 rounded">
          Add Post
        </button>
      </div>

      <ul>
        {posts.map((post) => (
          <li key={post.id} className="mb-4 p-4 border rounded shadow">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p>{post.content}</p>
            <button
              onClick={() => handleDelete(post.id)}
              className="mt-2 text-sm text-red-600 hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
