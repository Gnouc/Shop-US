const express = require('express');
const { body } = require('express-validator');
const categoriesController = require('./categories.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const roleMiddleware = require('../../middlewares/role.middleware');
const validateMiddleware = require('../../middlewares/validate.middleware');

const router = express.Router();

const categoryValidation = [
  body('name').notEmpty().withMessage('Category name is required'),
  body('description').optional(),
  body('image').optional(),
];

// Public routes
router.get('/', categoriesController.getAll);
router.get('/:id', categoriesController.getById);

// Admin routes
router.post(
  '/',
  authMiddleware,
  roleMiddleware('ADMIN'),
  categoryValidation,
  validateMiddleware,
  categoriesController.create
);

router.put(
  '/:id',
  authMiddleware,
  roleMiddleware('ADMIN'),
  categoryValidation,
  validateMiddleware,
  categoriesController.update
);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware('ADMIN'),
  categoriesController.delete
);

module.exports = router;
