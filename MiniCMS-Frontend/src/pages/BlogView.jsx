import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import Sidebar from "../components/Sidebar";
import Modal from "../components/Modal";
import { useNavigate } from "react-router-dom";

export default function BlogView() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const querySnapshot = await getDocs(collection(db, "blogs"));
    const fetchedPosts = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPosts(fetchedPosts);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this post?");
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, "blogs", id)); // ✅ fixed to match collection
      alert("Post deleted successfully");
      setSelectedPost(null);
      fetchPosts(); // refresh list
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post.");
    }
  };


  const handleUpdate = (post) => {
    navigate(`/blog-creation/${post.id}`, { state: post });
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
        <h2 className="text-3xl font-bold mb-6">All Blog Posts</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white shadow rounded p-4 cursor-pointer hover:shadow-lg transition"
              onClick={() => setSelectedPost(post)}
            >
              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt="Post thumbnail"
                  className="w-full h-40 object-cover rounded mb-2"
                />
              )}
              <h3 className="text-xl font-semibold mb-1">{post.title}</h3>
              <p className="text-sm text-gray-600">By {post.author}</p>
              <p className="text-xs text-gray-500">
                {post.category} • {post.language}
              </p>
              <p
                className="text-sm mt-2 line-clamp-3"
                dangerouslySetInnerHTML={{ __html: post.content }}
              ></p>
            </div>
          ))}
        </div>

        {selectedPost && (
          <Modal onClose={() => setSelectedPost(null)}>
            <div className="p-4 max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-2">{selectedPost.title}</h2>

              <div className="flex items-center gap-4 mb-4">
                {selectedPost.authorImg && (
                  <img
                    src={selectedPost.authorImg}
                    alt="Author"
                    className="w-10 h-10 rounded-full"
                  />
                )}
                <div>
                  <p className="text-sm font-medium">{selectedPost.author}</p>
                  <p className="text-xs text-gray-500">
                    {selectedPost.language} • {selectedPost.category}
                  </p>
                </div>
              </div>

              {selectedPost.imageUrl && (
                <img
                  src={selectedPost.imageUrl}
                  alt="Post"
                  className="w-full rounded mb-4"
                />
              )}

              {selectedPost.videoUrl && (
                <video controls className="w-full rounded mb-4">
                  <source src={selectedPost.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}

              {selectedPost.caption && (
                <p className="text-sm text-gray-700 mb-2 italic">
                  {selectedPost.caption}
                </p>
              )}

              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: selectedPost.content }}
              ></div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => handleUpdate(selectedPost)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(selectedPost.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            </div>
          </Modal>
        )}
      </main>
    </div>
  );
}
