const express = require('express');
const { body } = require('express-validator');
const cartsController = require('./carts.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const validateMiddleware = require('../../middlewares/validate.middleware');

const router = express.Router();

const addItemValidation = [
  body('productId').isInt().withMessage('Valid product ID is required'),
  body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
];

const updateItemValidation = [
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
];

// All routes require authentication
router.use(authMiddleware);

router.get('/', cartsController.getCart);
router.post('/items', addItemValidation, validateMiddleware, cartsController.addItem);
router.put('/items/:id', updateItemValidation, validateMiddleware, cartsController.updateItem);
router.delete('/items/:id', cartsController.removeItem);
router.delete('/clear', cartsController.clearCart);

module.exports = router;
