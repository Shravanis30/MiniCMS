import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db, auth } from "../firebase";
import Sidebar from "../components/Sidebar";
import { formatDistanceToNow } from "date-fns";

export default function ViewPosts() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);

      const postsData = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const imageUrl = localStorage.getItem(`image-${data.id}`);
        return {
          id: doc.id,
          ...data,
          imageUrl,
        };
      });

      setPosts(postsData);
    };  

    fetchPosts();
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6">All Posts</h1>

        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-start gap-4 bg-white shadow rounded p-4 hover:bg-gray-50 cursor-pointer"
              onClick={() => setSelectedPost(post)}
            >
              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt=""
                  className="w-32 h-32 object-cover rounded"
                />
              )}
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{post.title}</h2>
                <p className="text-sm text-gray-500 mb-1">
                  {post.category} • {formatDistanceToNow(new Date(post.createdAt?.seconds * 1000 || post.createdAt), { addSuffix: true })}
                </p>
                <p className="text-gray-700">
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded p-6 max-w-2xl w-full relative shadow-xl">
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-2 right-3 text-xl font-bold text-gray-600 hover:text-red-500"
              >
                &times;
              </button>
              {selectedPost.imageUrl && (
                <img
                  src={selectedPost.imageUrl}
                  alt=""
                  className="w-full h-60 object-cover rounded mb-4"
                />
              )}
              <h2 className="text-2xl font-bold mb-2">{selectedPost.title}</h2>
              <p className="text-sm text-gray-500 mb-2">
                {selectedPost.category} • {formatDistanceToNow(new Date(selectedPost.createdAt?.seconds * 1000 || selectedPost.createdAt), { addSuffix: true })}
              </p>
              <p className="mb-4">{selectedPost.content}</p>
              <p className="text-sm italic text-gray-600">Tags: {selectedPost.tags?.join(", ")}</p>
              <p className="text-sm mt-2 text-gray-500">Caption: {selectedPost.caption}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
