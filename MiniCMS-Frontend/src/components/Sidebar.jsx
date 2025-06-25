// Sidebar.jsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaBars,
  FaChevronLeft,
  FaPenNib,
  FaFileAlt,
  FaImage,
  FaSearch,
  FaUserShield,
  FaCloud,
  FaHome,
  FaSignOutAlt,
  FaEllipsisV,
} from "react-icons/fa";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const features = [

  { icon: <FaPenNib />, title: "Artical Writing", link: "/create-post" },
  { icon: <FaFileAlt />, title: "Blogs writing", link: "/blog-creation" },
  { icon: <FaImage />, title: "Image Uploads", link: "/media" },
  { icon: <FaSearch />, title: "Search & Filter", link: "/search" },
  { icon: <FaUserShield />, title: "Role-based Access", link: "/roles" },
  { icon: <FaCloud />, title: "Firebase Integration", link: "/firebase" },
];

export default function Sidebar({ collapsed, setCollapsed }) {
  const [showDropdown, setShowDropdown] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <aside
      className={`$ {
        collapsed ? "w-20" : "w-64"
      } bg-[#0b1120] text-white p-4 flex flex-col justify-between transition-all duration-300`}
    >
      <div>
        <div className="flex items-center justify-between mb-8">
          <span className="text-xl font-bold">
            {!collapsed && "MiniCMS"}
          </span>
          <button onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <FaBars size={20} /> : <FaChevronLeft size={20} />}
          </button>
        </div>

        <nav className="space-y-2">
          <Link
            to="/home"
            className={`flex items-center p-2 rounded hover:bg-[#1f2937] transition ${location.pathname === "/home" ? "bg-[#1f2937]" : ""}`}
          >
            <FaHome className="text-lg mr-3" />
            {!collapsed && "Home"}
          </Link>


          <div>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center w-full p-2 rounded hover:bg-[#1f2937] transition"
            >
              <FaEllipsisV className="text-lg mr-3" />
              {!collapsed && "More Options"}
            </button>

            {showDropdown && (
              <div className="ml-2 space-y-1">
                {features.map((item, index) => (
                  <Link
                    key={index}
                    to={item.link}
                    className={`flex items-center p-2 rounded hover:bg-[#1f2937] transition text-sm ${location.pathname === item.link ? "bg-[#1f2937]" : ""}`}
                  >
                    <span className="text-lg mr-3">{item.icon}</span>
                    {!collapsed && <span>{item.title}</span>}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center p-2 mt-4 rounded hover:bg-red-600 transition w-full"
      >
        <FaSignOutAlt className="text-xl mr-3" />
        {!collapsed && <span className="text-sm">Logout</span>}
      </button>
    </aside>
  );
}
