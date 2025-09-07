import express from "express";
import multer from "multer";
import { storage } from "../config/cloudinary.js";

const router = express.Router();
const upload = multer({ storage });

// POST /api/upload — upload multiple images
router.post("/", upload.array("images"), (req, res) => {
  // req.files is an array of files
  const imageUrls = req.files.map((file) => file.path);
  res.status(201).json({ imageUrls });
});

export default router;
