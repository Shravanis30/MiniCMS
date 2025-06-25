import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Sidebar from "../components/Sidebar";

export default function SearchFilter() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [allItems, setAllItems] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const postsSnapshot = await getDocs(collection(db, "posts"));
      const blogsSnapshot = await getDocs(collection(db, "blogs"));

      const posts = postsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        type: "post", // Tag to identify type
      }));

      const blogs = blogsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        type: "blog", // Tag to identify type
      }));

      const combinedData = [...posts, ...blogs];

      setAllItems(combinedData);
      setFilteredItems(combinedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = allItems.filter((item) =>
      item.title?.toLowerCase().includes(term) ||
      item.content?.toLowerCase().includes(term) ||
      item.tags?.join(", ").toLowerCase().includes(term)
    );
    setFilteredItems(filtered);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-800 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl text-cyan-50 font-bold mb-6">Search & Filter Posts & Blogs</h2>

          <input
            type="text"
            placeholder="Search by title, content, or tags..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full p-3 rounded border border-gray-300 text-white bg-gray-700 mb-6 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {filteredItems.length > 0 ? (
            <ul className="grid gap-6 grid-cols-1 sm:grid-cols-2">
              {filteredItems.map((item) => (
                <li
                  key={item.id}
                  className="bg-white border rounded-lg shadow p-4 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-blue-800">
                      {item.title || "Untitled"}
                    </h3>
                    <span className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded-full">
                      {item.type.toUpperCase()}
                    </span>
                  </div>

                  {item.tags?.length > 0 && (
                    <p className="text-sm text-gray-500 italic mb-2">
                      {item.tags.join(", ")}
                    </p>
                  )}

                  <p className="text-gray-700 text-sm">
                    {item.content
                      ? item.content.length > 120
                        ? item.content.slice(0, 120) + "..."
                        : item.content
                      : "No content available."}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-red-500 text-sm mt-8">
              No matching posts or blogs found.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
