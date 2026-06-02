const express = require('express');
const authRoutes = require('../modules/auth/auth.routes');
const categoriesRoutes = require('../modules/categories/categories.routes');
const productsRoutes = require('../modules/products/products.routes');
const cartsRoutes = require('../modules/carts/carts.routes');
const ordersRoutes = require('../modules/orders/orders.routes');
const adminRoutes = require('../modules/admin/admin.routes');
const uploadRoutes = require('../modules/upload/upload.routes');

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/categories', categoriesRoutes);
router.use('/products', productsRoutes);
router.use('/cart', cartsRoutes);
router.use('/orders', ordersRoutes);
router.use('/admin', adminRoutes);
router.use('/upload', uploadRoutes);

// 404 handler
router.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

module.exports = router;
