const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const authMiddleware = require('../../middlewares/auth.middleware');
const roleMiddleware = require('../../middlewares/role.middleware');

const router = express.Router();

// Tạo thư mục uploads nếu chưa có
const uploadDir = path.join(process.cwd(), 'uploads', 'products');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extOk = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeOk = allowedTypes.test(file.mimetype);
  if (extOk && mimeOk) {
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

// Upload single image
router.post(
  '/image',
  authMiddleware,
  roleMiddleware('ADMIN'),
  upload.single('image'),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const imageUrl = `/uploads/products/${req.file.filename}`;
    res.json({
      success: true,
      data: { imageUrl, filename: req.file.filename },
    });
  }
);

// Upload multiple images
router.post(
  '/images',
  authMiddleware,
  roleMiddleware('ADMIN'),
  upload.array('images', 5),
  (req, res) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }
    const imageUrls = req.files.map((f) => ({
      imageUrl: `/uploads/products/${f.filename}`,
      filename: f.filename,
    }));
    res.json({ success: true, data: imageUrls });
  }
);

// Delete image
router.delete(
  '/image',
  authMiddleware,
  roleMiddleware('ADMIN'),
  (req, res) => {
    const { filename } = req.body;
    if (!filename) {
      return res.status(400).json({ success: false, message: 'Filename required' });
    }
    const filePath = path.join(uploadDir, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    res.json({ success: true, message: 'File deleted' });
  }
);

module.exports = router;
