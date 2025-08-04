const express = require('express');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

const storage = multer.memoryStorage();

// --- THIS IS THE CRITICAL FIX ---
const upload = multer({ 
  storage: storage,
  // We are now telling multer to accept files up to 15MB.
  // This is larger than Cloudinary's 10MB limit, which ensures that
  // the file is passed to Cloudinary for processing, where it will be resized.
  limits: { fileSize: 15 * 1024 * 1024 } // 15 Megabytes
});
// --- END OF FIX ---

router.post('/', protect, upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file provided.' });
  }

  try {
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'cork-grill',
          transformation: [
            { width: 1200, crop: 'limit' },
            { quality: 'auto:good' }
          ]
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    res.status(201).json({ 
      message: 'Image uploaded and optimized successfully', 
      imageUrl: result.secure_url 
    });

  } catch (error) {
    // This now provides a much better error message if Cloudinary is the one rejecting the file
    if (error.http_code === 400 && error.message.includes('File size too large')) {
        return res.status(400).json({ message: `File size too large. Cloudinary's limit is 10MB.`});
    }
    console.error('Cloudinary Upload Error:', error);
    res.status(500).json({ message: 'Failed to upload image.' });
  }
});

module.exports = router;