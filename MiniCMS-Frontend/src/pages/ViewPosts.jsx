import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import Sidebar from "../components/Sidebar";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";


export default function ViewPosts() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const postsData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPosts(postsData);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await deleteDoc(doc(db, "posts", id));
      alert("✅ Post deleted");
      setSelectedPost(null);
      fetchPosts();
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete post.");
    }
  };

  const handleUpdate = (post) => {
    navigate(`/create-post/${post.id}`, { state: post });
  };



  return (
    <div className="flex min-h-screen">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main className="flex-1 px-4 py-4 sm:px-6 sm:py-6 bg-gray-800 overflow-y-auto transition-all duration-300">
        <h1 className="text-xl sm:text-3xl text-gray-50 font-bold mb-4 sm:mb-6 text-center sm:text-left">
          All Posts
        </h1>

        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex flex-col sm:flex-row items-start gap-4 bg-gray-300 shadow rounded p-4 hover:bg-gray-200 cursor-pointer transition"
              onClick={() => setSelectedPost(post)}
            >
              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt=""
                  className="w-full sm:w-32 h-auto sm:h-32 object-cover rounded"
                />
              )}
              <div className="flex-1">
                <h2 className="text-lg sm:text-xl font-semibold">{post.title}</h2>
                <p className="text-xs sm:text-sm text-gray-500 mb-1">
                  {post.category} •{" "}
                  {formatDistanceToNow(
                    new Date(post.createdAt?.seconds * 1000 || post.createdAt),
                    { addSuffix: true }
                  )}
                </p>
                <p className="text-gray-700 text-sm">
                  {post.content.length > 100
                    ? post.content.slice(0, 100) + "..."
                    : post.content}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {selectedPost && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 p-2 sm:p-6">
            <div className="bg-gray-300 rounded-lg p-4 sm:p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto relative shadow-lg">
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-3 right-4 text-2xl font-bold text-gray-600 hover:text-red-600"
              >
                &times;
              </button>

              {/* Author Info Inside Modal */}
              <div className="flex items-center gap-3 mb-4">
                {selectedPost.authorImg && (
                  <img
                    src={selectedPost.authorImg}
                    alt="Author"
                    className="w-10 h-10 rounded-full"
                  />
                )}
                <div>
                  <p className="font-medium text-sm sm:text-base">{selectedPost.author}</p>
                  <p className="text-xs text-gray-500">
                    {selectedPost.category} •{" "}
                    {formatDistanceToNow(
                      new Date(
                        selectedPost.createdAt?.seconds * 1000 ||
                        selectedPost.createdAt
                      ),
                      { addSuffix: true }
                    )}
                  </p>
                </div>
              </div>

              {/* Image */}
              {selectedPost.imageUrl && (
                <img
                  src={selectedPost.imageUrl}
                  alt=""
                  className="w-full max-h-[200px] sm:max-h-64 object-contain rounded mb-4"
                />
              )}

              {/* Video */}
              {selectedPost.videoUrl && (
                <video controls className="w-full rounded mb-4 max-h-[200px] sm:max-h-64 object-contain">
                  <source src={selectedPost.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}

              {/* Caption */}
              {selectedPost.caption && (
                <p className="italic text-sm text-gray-700 mb-3">
                  {selectedPost.caption}
                </p>
              )}

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-bold mb-2">{selectedPost.title}</h2>

              {/* Content */}
              <div
                className="prose max-w-none text-gray-800 text-sm sm:text-base"
                dangerouslySetInnerHTML={{ __html: selectedPost.content }}
              />

              {/* Tags */}
              {selectedPost.tags?.length > 0 && (
                <p className="text-xs sm:text-sm italic text-gray-600 mt-4">
                  Tags: {selectedPost.tags.join(", ")}
                </p>
              )}

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-6">
                <button
                  onClick={() => handleUpdate(selectedPost)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full sm:w-auto"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(selectedPost.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full sm:w-auto"
                >
                  Delete
                </button>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 w-full sm:w-auto"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Author Info (Floating) */}
        {selectedPost?.author && (
          <div className="fixed bottom-4 left-4 z-50 bg-white shadow-md px-3 py-1.5 rounded-full flex items-center gap-2 border border-gray-200 text-xs sm:text-sm">
            {selectedPost.authorImg && (
              <img
                src={selectedPost.authorImg}
                alt="Author"
                className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover"
              />
            )}
            <span className="font-medium text-gray-800">{selectedPost.author}</span>
          </div>
        )}
      </main>

    </div>
  );
}
