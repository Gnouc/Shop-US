const express = require('express');
const { body } = require('express-validator');
const adminController = require('./admin.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const roleMiddleware = require('../../middlewares/role.middleware');
const validateMiddleware = require('../../middlewares/validate.middleware');

const router = express.Router();

// All routes require admin role
router.use(authMiddleware);
router.use(roleMiddleware('ADMIN'));

// Dashboard
router.get('/dashboard', adminController.getDashboard);

// Orders management
router.get('/orders', adminController.getAllOrders);
router.patch(
  '/orders/:id/status',
  body('status').isIn(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPING', 'DELIVERED', 'CANCELLED']),
  validateMiddleware,
  adminController.updateOrderStatus
);

// Users management
router.get('/users', adminController.getAllUsers);
router.patch(
  '/users/:id/role',
  body('role').isIn(['USER', 'ADMIN']),
  validateMiddleware,
  adminController.updateUserRole
);

module.exports = router;
