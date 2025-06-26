import React, { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import Sidebar from "../components/Sidebar";
import { formatDistanceToNow } from "date-fns";
import { FaTrash } from "react-icons/fa";

export default function ViewImages() {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [collapsed, setCollapsed] = useState(false);


  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    const q = query(collection(db, "images"), orderBy("uploadedAt", "desc"));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setImages(data);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    try {
      await deleteDoc(doc(db, "images", id));
      alert("Image deleted successfully.");
      setImages((prev) => prev.filter((img) => img.id !== id));
      setSelectedImage(null);
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Failed to delete image.");
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main className="flex-1 px-4 py-6 sm:px-6 bg-gray-800 overflow-y-auto transition-all duration-300">
        <h2 className="text-3xl text-cyan-50 font-bold mb-6">Uploaded Images</h2>

        <div className="grid grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6">
          {images.map((img) => (
            <div
              key={img.id}
              className="bg-gray-700 shadow rounded-lg overflow-hidden relative border border-gray-600 group cursor-pointer"
              onClick={() => setSelectedImage(img)}
            >
              {/* Delete Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // prevent modal opening
                  handleDelete(img.id);
                }}
                className="absolute top-2 right-2 bg-blue-600 hover:bg-blue-700 text-white p-1 rounded-full z-20"
                title="Delete Image"
              >
                <FaTrash size={14} />
              </button>

              {/* Author Info */}
              <div className="absolute top-2 left-2 bg-white/80 backdrop-blur px-2 py-1 rounded-md flex items-center gap-2 z-10">
                {img.authorImg && (
                  <img
                    src={img.authorImg}
                    alt="Author"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                )}
                <div className="text-xs">
                  <p className="font-semibold text-gray-800">{img.authorName}</p>
                  <p className="text-gray-500 text-[10px]">
                    {img.uploadedAt?.seconds &&
                      formatDistanceToNow(
                        new Date(img.uploadedAt.seconds * 1000),
                        { addSuffix: true }
                      )}
                  </p>
                </div>
              </div>

              {/* Image */}
              <div className="w-full h-72 bg-white/20 backdrop-blur-sm flex items-center justify-center rounded">
                <img
                  src={img.imageUrl}
                  alt="Uploaded"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Fullscreen Image Popup */}
        {selectedImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-white/30 p-4">
            <div className="relative bg-white rounded-lg max-w-4xl w-full shadow-lg overflow-hidden">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 text-xl font-bold text-gray-700 hover:text-black"
              >
                ✕
              </button>

              <div className="p-4">
                <img
                  src={selectedImage.imageUrl}
                  alt="Full View"
                  className="w-full max-h-[80vh] object-contain rounded"
                />

                <div className="flex items-center gap-3 mt-4">
                  {selectedImage.authorImg && (
                    <img
                      src={selectedImage.authorImg}
                      alt="Author"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <p className="text-sm font-medium">{selectedImage.authorName}</p>
                    <p className="text-xs text-gray-500">
                      {selectedImage.uploadedAt?.seconds &&
                        formatDistanceToNow(
                          new Date(selectedImage.uploadedAt.seconds * 1000),
                          { addSuffix: true }
                        )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
