const productsService = require('./products.service');

class ProductsController {
  async getAll(req, res, next) {
    try {
      const result = await productsService.getAll(req.query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getAllAdmin(req, res, next) {
    try {
      const result = await productsService.getAll(req.query, { includeInactive: true });
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const result = await productsService.getById(parseInt(req.params.id));
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getBySlug(req, res, next) {
    try {
      const result = await productsService.getBySlug(req.params.slug);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const result = await productsService.create(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const result = await productsService.update(parseInt(req.params.id), req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req, res, next) {
    try {
      const { status } = req.body;
      const result = await productsService.updateStatus(parseInt(req.params.id), status);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const result = await productsService.delete(parseInt(req.params.id));
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProductsController();
