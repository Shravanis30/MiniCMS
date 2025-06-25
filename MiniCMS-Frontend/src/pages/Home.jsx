
// import React, { useEffect, useState } from "react";
// import { signOut } from "firebase/auth";
// import { useNavigate } from "react-router-dom";
// import { Link, Outlet, useLocation } from "react-router-dom";
// import {
//   FaBars,
//   FaChevronLeft,
//   FaPenNib,
//   FaFileAlt,
//   FaImage,
//   FaSearch,
//   FaUserShield,
//   FaCloud,
//   FaHome,
//   FaSignOutAlt,
//   FaEllipsisV,
// } from "react-icons/fa";
// import { onAuthStateChanged } from "firebase/auth";
// import { auth, db } from "../firebase";
// import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";

// const features = [
//   { icon: <FaPenNib />, title: "Easy Post Creation", link: "/create-post" },
//   { icon: <FaFileAlt />, title: "Rich Text Editing", link: "/editor" },
//   { icon: <FaImage />, title: "Image Uploads", link: "/media" },
//   { icon: <FaSearch />, title: "Search & Filter", link: "/search" },
//   { icon: <FaUserShield />, title: "Role-based Access", link: "/roles" },
//   { icon: <FaCloud />, title: "Firebase Integration", link: "/firebase" },
// ];

// export default function SidebarLayout() {
//   const [collapsed, setCollapsed] = useState(false);
//   const [showDropdown, setShowDropdown] = useState(true);
//   const location = useLocation();
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       navigate("/");
//     } catch (error) {
//       console.error("Logout failed:", error.message);
//     }
//   };
//   const [user, setUser] = useState(null);
//   const [recentPosts, setRecentPosts] = useState([]);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//     });
//     return () => unsubscribe();
//   }, []);

//   useEffect(() => {
//     const fetchRecentPosts = async () => {
//       if (!user) return;
//       const q = query(
//         collection(db, "posts"),
//         where("uid", "==", user.uid),
//         orderBy("createdAt", "desc"),
//         limit(5)
//       );
//       const querySnapshot = await getDocs(q);
//       const posts = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//       setRecentPosts(posts);
//     };
//     fetchRecentPosts();
//   }, [user]);


//   const toggleSidebar = () => setCollapsed(!collapsed);

//   return (
//     <div className="flex min-h-screen bg-white text-black">
//       {/* Sidebar */}
//       <aside
//         className={`$ {
//           collapsed ? "w-20" : "w-64"
//         } bg-[#0b1120] text-white p-4 flex flex-col justify-between transition-all duration-300`}
//       >
//         <div>
//           <div className="flex items-center justify-between mb-8">
//             <span className="text-xl font-bold">
//               {!collapsed && "MiniCMS"}
//             </span>
//             <button onClick={toggleSidebar}>
//               {collapsed ? <FaBars size={20} /> : <FaChevronLeft size={20} />}
//             </button>
//           </div>

//           <nav className="space-y-2">
//             <button
//               className={`flex items-center p-2 rounded hover:bg-[#1f2937] transition ${location.pathname === "/home" ? "bg-[#1f2937]" : ""}`}
//             >
//               <FaHome className="text-lg mr-3" />
//               {!collapsed && "Home"}
//             </button>


//             <div>
//               <button
//                 onClick={() => setShowDropdown(!showDropdown)}
//                 className="flex items-center w-full p-2 rounded hover:bg-[#1f2937] transition"
//               >
//                 <FaEllipsisV className="text-lg mr-3" />
//                 {!collapsed && "More Options"}
//               </button>

//               {showDropdown && (
//                 <div className="ml-2 space-y-1">
//                   {features.map((item, index) => (
//                     <Link
//                       key={index}
//                       to={item.link}
//                       className={`flex items-center p-2 rounded hover:bg-[#1f2937] transition text-sm ${location.pathname === item.link ? "bg-[#1f2937]" : ""}`}
//                     >
//                       <span className="text-lg mr-3">{item.icon}</span>
//                       {!collapsed && <span>{item.title}</span>}
//                     </Link>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </nav>
//         </div>

//         {/* Logout button */}
//         <button
//           onClick={handleLogout}
//           className="flex items-center p-2 mt-4 rounded hover:bg-red-600 transition w-full"
//         >
//           <FaSignOutAlt className="text-xl mr-3" />
//           {!collapsed && <span className="text-sm">Logout</span>}
//         </button>

//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 bg-white text-black p-6 overflow-y-auto">
//         <div className="space-y-10">
//           {/* Welcome Message */}
//           <div className="bg-gray-100 p-6 rounded shadow">
//             <h1 className="text-3xl font-bold text-gray-800">
//               {user ? (
//                 user.metadata.creationTime === user.metadata.lastSignInTime ? (
//                   <>Welcome, <span className="text-blue-600">{user.displayName || "User"}</span> 👋</>
//                 ) : (
//                   <>Welcome back, <span className="text-blue-600">{user.displayName || "User"}</span> 👋</>
//                 )
//               ) : (
//                 "Welcome"
//               )}
//             </h1>
//           </div>

//           {/* Recent Work */}
//           <div className="bg-gray-100 p-6 rounded shadow">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
//             {recentPosts.length === 0 ? (
//               <p className="text-gray-500">No recent posts found.</p>
//             ) : (
//               <ul className="space-y-3">
//                 {recentPosts.map((post) => (
//                   <li key={post.id} className="bg-white p-4 rounded shadow border">
//                     <h3 className="text-lg font-medium">{post.title}</h3>
//                     <p className="text-gray-600 text-sm">{post.content?.slice(0, 100)}...</p>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           {/* CMS Quick Links */}
//           <div className="bg-gray-100 p-6 rounded shadow">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
//             <div className="grid grid-cols-2 gap-4">
//               <button className="bg-blue-600 text-white p-4 rounded hover:bg-blue-500">View Posts</button>
//               <button className="bg-green-600 text-white p-4 rounded hover:bg-green-500">View Images</button>
//               <button className="bg-yellow-600 text-white p-4 rounded hover:bg-yellow-500">Search Content</button>
//               <button className="bg-purple-600 text-white p-4 rounded hover:bg-purple-500">Manage Roles</button>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }



// Home.jsx
import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import Sidebar from "../components/Sidebar";
import {Link} from "react-router-dom";


export default function Home() {
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);

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

  return (
    <div className="flex min-h-screen bg-white text-black">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <main className="flex-1 bg-white text-black p-6 overflow-y-auto">
        <div className="space-y-10">
          <div className="bg-gray-100 p-6 rounded shadow">
            <h1 className="text-3xl font-bold text-gray-800">
              {user ? (
                user.metadata.creationTime === user.metadata.lastSignInTime ? (
                  <>Welcome, <span className="text-blue-600">{user.displayName || "User"}</span> 👋</>
                ) : (
                  <>Welcome back, <span className="text-blue-600">{user.displayName || "User"}</span> 👋</>
                )
              ) : (
                "Welcome"
              )}
            </h1>
          </div>

          <div className="bg-gray-100 p-6 rounded shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
            {recentPosts.length === 0 ? (
              <p className="text-gray-500">No recent posts found.</p>
            ) : (
              <ul className="space-y-3">
                {recentPosts.map((post) => (
                  <li key={post.id} className="bg-white p-4 rounded shadow border">
                    <h3 className="text-lg font-medium">{post.title}</h3>
                    <p className="text-gray-600 text-sm">{post.content?.slice(0, 100)}...</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-gray-100 p-6 rounded shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>

              <div className="grid grid-cols-2 gap-4">
                <Link to="/view-posts">
                  <button className="bg-blue-600 text-white p-4 rounded hover:bg-blue-500 w-full">
                    View Posts
                  </button>
                </Link>

                <Link to="/blog-view">
                  <button className="bg-green-600 text-white p-4 rounded hover:bg-green-500 w-full">
                    view Blogs
                  </button>
                </Link>

                <Link to="/search">
                  <button className="bg-yellow-600 text-white p-4 rounded hover:bg-yellow-500 w-full">
                    Search Content
                  </button>
                </Link>

                <Link to="/roles">
                  <button className="bg-purple-600 text-white p-4 rounded hover:bg-purple-500 w-full">
                    Manage Roles
                  </button>
                </Link>
              </div>
          </div>
        </div>
      </main>
    </div>
  );
}
