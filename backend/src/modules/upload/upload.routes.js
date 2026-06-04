const express = require('express');
const multer = require('multer');
const cloudinary = require('../../config/cloudinary');
const streamifier = require('streamifier');
const authMiddleware = require('../../middlewares/auth.middleware');
const roleMiddleware = require('../../middlewares/role.middleware');

const router = express.Router();

// Multer config — lưu vào memory (không ghi file), sau đó upload lên Cloudinary
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const mimeOk = allowedTypes.test(file.mimetype);
  if (mimeOk) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ cho phép ảnh JPG, PNG, WEBP'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// Helper: upload buffer lên Cloudinary
function uploadToCloudinary(fileBuffer, options = {}) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'us-health-store/products',
        resource_type: 'image',
        ...options,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
}

// Upload single image
router.post(
  '/image',
  authMiddleware,
  roleMiddleware('ADMIN'),
  upload.single('image'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
      }

      const result = await uploadToCloudinary(req.file.buffer);

      res.json({
        success: true,
        data: {
          imageUrl: result.secure_url,
          publicId: result.public_id,
          filename: result.public_id, // dùng publicId làm filename để xóa sau
        },
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Upload failed',
      });
    }
  }
);

// Upload multiple images
router.post(
  '/images',
  authMiddleware,
  roleMiddleware('ADMIN'),
  upload.array('images', 5),
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ success: false, message: 'No files uploaded' });
      }

      const results = await Promise.all(
        req.files.map((file) => uploadToCloudinary(file.buffer))
      );

      const imageUrls = results.map((r) => ({
        imageUrl: r.secure_url,
        publicId: r.public_id,
        filename: r.public_id,
      }));

      res.json({ success: true, data: imageUrls });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Upload failed',
      });
    }
  }
);

// Delete image from Cloudinary
router.delete(
  '/image',
  authMiddleware,
  roleMiddleware('ADMIN'),
  async (req, res) => {
    try {
      const { filename } = req.body; // filename = publicId
      if (!filename) {
        return res.status(400).json({ success: false, message: 'Filename/publicId required' });
      }

      await cloudinary.uploader.destroy(filename);

      res.json({ success: true, message: 'Image deleted from Cloudinary' });
    } catch (error) {
      console.error('Delete error:', error);
      res.status(500).json({ success: false, message: 'Delete failed' });
    }
  }
);

module.exports = router;
