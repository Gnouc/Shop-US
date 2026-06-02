const cartsService = require('./carts.service');

class CartsController {
  async getCart(req, res, next) {
    try {
      const result = await cartsService.getCart(req.user.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async addItem(req, res, next) {
    try {
      const result = await cartsService.addItem(req.user.id, req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async updateItem(req, res, next) {
    try {
      const result = await cartsService.updateItem(
        req.user.id,
        parseInt(req.params.id),
        req.body.quantity
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async removeItem(req, res, next) {
    try {
      const result = await cartsService.removeItem(req.user.id, parseInt(req.params.id));
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async clearCart(req, res, next) {
    try {
      const result = await cartsService.clearCart(req.user.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CartsController();
