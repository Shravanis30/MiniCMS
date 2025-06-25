import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import Sidebar from "../components/Sidebar";
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
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await deleteDoc(doc(db, "blogs", id));
      alert("Post deleted successfully");
      setSelectedPost(null);
      fetchPosts();
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
      <main className="flex-1 p-4 md:p-6 overflow-y-auto bg-gray-800">
        <h2 className="text-3xl  text-gray-50 font-bold mb-6">All Blog Posts</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-gray-300 shadow rounded p-4 cursor-pointer hover:shadow-lg transition"
              onClick={() => setSelectedPost(post)}
            >
              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt="Post"
                  className="w-full h-40 object-cover rounded mb-2"
                />
              )}
              <h3 className="text-lg font-semibold mb-1">{post.title}</h3>
              <div className="flex items-center gap-2 mb-1">
                {post.authorImg && (
                  <img
                    src={post.authorImg}
                    alt="Author"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                )}
                <p className="text-sm text-gray-700">{post.author}</p>
              </div>
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
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/70 p-4">
            <div className="bg-gray-300 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg shadow-xl p-6 relative">
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-2 right-2 text-xl font-bold text-gray-600 hover:text-black"
              >
                ✕
              </button>

              <h2 className="text-2xl font-bold mb-4">{selectedPost.title}</h2>

              <div className="flex items-center gap-4 mb-4">
                {selectedPost.authorImg && (
                  <img
                    src={selectedPost.authorImg}
                    alt="Author"
                    className="w-10 h-10 rounded-full object-cover"
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
                  className="w-full h-auto rounded mb-4 object-contain max-h-72"
                />
              )}

              {selectedPost.videoUrl && (
                <video
                  controls
                  className="w-full max-h-72 object-contain rounded mb-4"
                >
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
                className="prose max-w-none text-sm"
                dangerouslySetInnerHTML={{ __html: selectedPost.content }}
              ></div>

              <div className="flex flex-wrap gap-3 mt-6">
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
          </div>
        )}
      </main>
    </div>
  );
}
