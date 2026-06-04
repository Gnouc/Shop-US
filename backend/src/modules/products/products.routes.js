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
  body('salePrice')
    .optional({ nullable: true })
    .custom((value) => {
      if (value === null || value === undefined || value === '' || value === 0) return true;
      if (isNaN(value) || Number(value) < 0) {
        throw new Error('Sale price must be positive');
      }
      return true;
    }),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be non-negative'),
  body('brand').optional(),
  body('origin').optional(),
  body('description').optional(),
];

// Admin routes
router.get(
  '/admin/all',
  authMiddleware,
  roleMiddleware('ADMIN'),
  productsController.getAllAdmin
);

// Public routes
router.get('/', productsController.getAll);
router.get('/slug/:slug', productsController.getBySlug);
router.get('/:id', productsController.getById);

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
