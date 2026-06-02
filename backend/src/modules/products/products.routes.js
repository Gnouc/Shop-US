const express = require('express');
const { body } = require('express-validator');
const productsController = require('./products.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const roleMiddleware = require('../../middlewares/role.middleware');
const validateMiddleware = require('../../middlewares/validate.middleware');

const router = express.Router();

const productValidation = [
  body('name').notEmpty().withMessage('Product name is required'),
  body('categoryId').isInt().withMessage('Valid category is required'),
  body('price').isFloat({ min: 0 }).withMessage('Valid price is required'),
  body('salePrice').optional().isFloat({ min: 0 }).withMessage('Sale price must be positive'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be non-negative'),
  body('brand').optional(),
  body('origin').optional(),
  body('description').optional(),
];

// Public routes
router.get('/', productsController.getAll);
router.get('/slug/:slug', productsController.getBySlug);
router.get('/:id', productsController.getById);

// Admin routes
router.post(
  '/',
  authMiddleware,
  roleMiddleware('ADMIN'),
  productValidation,
  validateMiddleware,
  productsController.create
);

router.put(
  '/:id',
  authMiddleware,
  roleMiddleware('ADMIN'),
  productValidation,
  validateMiddleware,
  productsController.update
);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware('ADMIN'),
  productsController.delete
);

router.patch(
  '/:id/status',
  authMiddleware,
  roleMiddleware('ADMIN'),
  productsController.updateStatus
);

module.exports = router;
