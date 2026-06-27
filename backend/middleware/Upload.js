import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import path from "path";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "datasets",
    resource_type: "auto", // supports raw files like csv
    public_id: (req, file) => Date.now() + path.parse(file.originalname).name,
  },
});

const upload = multer({ storage });

export default upload;
