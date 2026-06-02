const express = require('express');
const { body } = require('express-validator');
const authController = require('./auth.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const validateMiddleware = require('../../middlewares/validate.middleware');

const router = express.Router();

// Validation rules
const registerValidation = [
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('name').notEmpty().withMessage('Name is required'),
  body('phone').optional().isMobilePhone('vi-VN').withMessage('Invalid phone number'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').notEmpty().withMessage('Password is required'),
];

const updateProfileValidation = [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('phone').optional().isMobilePhone('vi-VN').withMessage('Invalid phone number'),
];

// Routes
router.post('/register', registerValidation, validateMiddleware, authController.register);
router.post('/login', loginValidation, validateMiddleware, authController.login);
router.get('/me', authMiddleware, authController.getProfile);
router.put('/profile', authMiddleware, updateProfileValidation, validateMiddleware, authController.updateProfile);

module.exports = router;
