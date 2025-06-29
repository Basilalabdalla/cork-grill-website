const express = require('express');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Configure multer for in-memory storage. 
// This is efficient because we don't need to save the file to our server's disk.
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Define the upload route. It's protected, so only admins can upload.
// 'upload.single('image')' tells multer to expect a single file named 'image'.
router.post('/', protect, upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file provided.' });
  }

  try {
    // Multer adds the file to the request object. We can then upload it.
    // We upload the file buffer to Cloudinary.
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { 
    folder: 'cork-grill',
    // --- NEW: Add this transformation ---
    transformation: [
      // This will resize the image to be a maximum of 1200px wide,
      // keeping the aspect ratio, and will set the quality to auto.
      // This drastically reduces the file size of large images.
      { width: 1200, crop: 'limit', quality: 'auto' }
    ]
  }, 
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    // Send back the secure URL of the uploaded image.
    res.status(201).json({ 
      message: 'Image uploaded successfully', 
      imageUrl: result.secure_url 
    });

  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    res.status(500).json({ message: 'Failed to upload image.', error });
  }
});

module.exports = router;