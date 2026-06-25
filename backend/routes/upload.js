import express from "express";
import multer from "multer";
import { storage } from "../config/cloudinary.js";

const router = express.Router();
const upload = multer({ storage });

// POST /api/upload — upload multiple images
router.post("/", upload.array("images"), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }
    const imageUrls = req.files.map((file) => file.path);
    res.status(201).json({ imageUrls });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Image upload failed", error });
  }
});


export default router;
