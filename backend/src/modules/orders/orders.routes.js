const express = require('express');
const { body } = require('express-validator');
const ordersController = require('./orders.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const roleMiddleware = require('../../middlewares/role.middleware');
const validateMiddleware = require('../../middlewares/validate.middleware');

const router = express.Router();

const createOrderValidation = [
  body('customerName').notEmpty().withMessage('Customer name is required'),
  body('phone').isMobilePhone('vi-VN').withMessage('Valid phone number is required'),
  body('address').notEmpty().withMessage('Address is required'),
  body('note').optional(),
];

// User routes
router.post(
  '/',
  authMiddleware,
  createOrderValidation,
  validateMiddleware,
  ordersController.create
);

router.get('/my-orders', authMiddleware, ordersController.getMyOrders);
router.get('/:id', authMiddleware, ordersController.getOrderById);
router.patch('/:id/cancel', authMiddleware, ordersController.cancelOrder);

module.exports = router;
