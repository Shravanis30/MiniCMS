// const express = require("express");
// const cors = require("cors");
// const app = express();
// const postRoutes = require("./routes/posts.routes.js");

// app.use(cors());
// app.use(express.json());
// app.use("/posts", postRoutes);

// app.listen(5000, () => {
//   console.log("Server running at http://localhost:5000");
// // });

// const express = require("express");
// const multer = require("multer");
// const upload = multer({ storage });

// const cors = require("cors");
// const cloudinary = require("cloudinary").v2;
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// require("dotenv").config();


// const app = express();

// app.use(cors());
// app.use(express.json());

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // ✅ Upload image to Cloudinary
// app.post("/upload", upload.single("image"), (req, res) => {
//   try {
//     res.json({ imageUrl: req.file.path });
//   } catch (err) {
//     res.status(500).json({ error: "Upload failed" });
//   }
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server started on port ${PORT}`));




import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import upload from "./src/middlewares/uploadMiddleware.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Image upload route
app.post("/upload", upload.single("image"), (req, res) => {
  try {
    res.json({ imageUrl: req.file.path });
  } catch (error) {
    console.error("Upload failed:", error);
    res.status(500).json({ message: "Upload failed" });
  }
});


app.listen(5000, () => {
  console.log("🚀 Server running at http://localhost:5000");
});
