import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";
import { FaRegImages, FaRegNewspaper, FaBlog } from "react-icons/fa";
import { getAuth } from "firebase/auth";




export default function Home() {
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const [userEmail, setUserEmail] = useState("");


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      if (!user) return;
      const q = query(
        collection(db, "posts"),
        where("uid", "==", user.uid),
        orderBy("createdAt", "desc"),
        limit(5)
      );
      const querySnapshot = await getDocs(q);
      const posts = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRecentPosts(posts);
    };
    fetchRecentPosts();
  }, [user]);


  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUserEmail(currentUser.email);
      fetchUserPosts(currentUser.email);
    }
  }, []);

  const fetchUserPosts = async (email) => {
    try {
      const q = query(
        collection(db, "posts"),
        where("authorEmail", "==", email),
        orderBy("updatedAt", "desc") // or "uploadedAt" if you use that
      );

      const snapshot = await getDocs(q);
      const posts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setRecentPosts(posts.slice(0, 5)); // Show only 5 recent posts
    } catch (error) {
      console.error("Error fetching recent posts:", error);
    }
  };


  return (
    <div className="flex min-h-screen bg-white text-black">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <main className="flex-1 bg-gray-800 text-black p-6 overflow-y-auto">
        <div className="space-y-10">
          <div className="bg-gray-700 p-6 rounded shadow">
            <h1 className="text-3xl font-bold text-gray-100">
              {user ? (
                user.metadata.creationTime === user.metadata.lastSignInTime ? (
                  <>Welcome, <span className="text-blue-600">{user.displayName || "User"}</span> </>
                ) : (
                  <>Welcome back, <span className="text-blue-600">{user.displayName || "User"}</span> </>
                )
              ) : (
                "Welcome"
              )}
            </h1>
          </div>

          <div className="bg-gray-700 p-6 rounded shadow">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">Recent Activity</h2>

            {recentPosts.length === 0 ? (
              <p className="text-gray-100">No recent posts found.</p>
            ) : (
              <ul className="space-y-3">
                {recentPosts.map((post) => (
                  <li
                    key={post.id}
                    className="bg-white p-4 rounded shadow border border-gray-200"
                  >
                    <h3 className="text-lg font-medium text-gray-800">
                      {post.title || "Untitled Post"}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {post.content
                        ? post.content.slice(0, 100) + (post.content.length > 100 ? "..." : "")
                        : "No content available."}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-gray-800 p-6 rounded shadow">
            <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>

            <div className="grid sm:grid-cols-1 lg:grid-cols-3 gap-4">
              <Link to="/view-posts">
                <div className="bg-gray-700 hover:bg-blue-400 text-white rounded-lg p-6 flex flex-col items-center justify-center shadow transition">
                  <FaRegNewspaper className="text-3xl mb-2" />
                  <span className="font-medium">View Posts</span>
                </div>
              </Link>

              <Link to="/blog-view">
                <div className="bg-gray-700 hover:bg-blue-400 text-white rounded-lg p-6 flex flex-col items-center justify-center shadow transition">
                  <FaBlog className="text-3xl mb-2" />
                  <span className="font-medium">View Blogs</span>
                </div>
              </Link>

              <Link to="/view-images">
                <div className="bg-gray-700 hover:bg-blue-400 text-white rounded-lg p-6 flex flex-col items-center justify-center shadow transition">
                  <FaRegImages className="text-3xl mb-2" />
                  <span className="font-medium">View Images</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
