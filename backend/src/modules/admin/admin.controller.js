const adminService = require('./admin.service');

class AdminController {
  async getDashboard(req, res, next) {
    try {
      const result = await adminService.getDashboard();
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getAllOrders(req, res, next) {
    try {
      const ordersService = require('../orders/orders.service');
      const result = await ordersService.getAllOrders(req.query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async updateOrderStatus(req, res, next) {
    try {
      const ordersService = require('../orders/orders.service');
      const { status } = req.body;
      const result = await ordersService.updateOrderStatus(parseInt(req.params.id), status);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getAllUsers(req, res, next) {
    try {
      const result = await adminService.getAllUsers(req.query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async updateUserRole(req, res, next) {
    try {
      const { role } = req.body;
      const result = await adminService.updateUserRole(parseInt(req.params.id), role);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AdminController();
