// src/middlewares/uploadMiddleware.js
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js"; 

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "MiniCMS",
    allowed_formats: ["jpg", "png", "jpeg"],
    transformation: [{ width: 800, height: 600, crop: "limit" }],
  },
});

const upload = multer({ storage });

export default upload;
