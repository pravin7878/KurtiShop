const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../config/cloudinary');

const upload = multer({ storage });

// POST /api/upload — upload multiple images
router.post('/', upload.array('images'), (req, res) => {
  // req.files is an array of files
  // console.log(req.files);
  
  const imageUrls = req.files.map(file => file.path);
  res.status(201).json({ imageUrls });
});

module.exports = router;