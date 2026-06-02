const ordersService = require('./orders.service');

class OrdersController {
  async create(req, res, next) {
    try {
      const result = await ordersService.create(req.user.id, req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getMyOrders(req, res, next) {
    try {
      const result = await ordersService.getMyOrders(req.user.id, req.query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getOrderById(req, res, next) {
    try {
      const result = await ordersService.getOrderById(req.user.id, parseInt(req.params.id));
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async cancelOrder(req, res, next) {
    try {
      const result = await ordersService.cancelOrder(req.user.id, parseInt(req.params.id));
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // Admin methods
  async getAllOrders(req, res, next) {
    try {
      const result = await ordersService.getAllOrders(req.query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async updateOrderStatus(req, res, next) {
    try {
      const { status } = req.body;
      const result = await ordersService.updateOrderStatus(parseInt(req.params.id), status);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new OrdersController();
