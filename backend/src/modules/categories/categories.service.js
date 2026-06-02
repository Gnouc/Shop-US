const prisma = require('../../database/prisma');
const generateSlug = require('../../utils/generateSlug');

class CategoriesService {
  async getAll() {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      data: categories,
    };
  }

  async getById(id) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        products: {
          where: { status: 'ACTIVE' },
          take: 10,
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            salePrice: true,
            images: {
              where: { isPrimary: true },
              take: 1,
            },
          },
        },
      },
    });

    if (!category) {
      const error = new Error('Category not found');
      error.statusCode = 404;
      throw error;
    }

    return {
      success: true,
      data: category,
    };
  }

  async create(data) {
    const { name, description, image } = data;
    const slug = generateSlug(name);

    // Check if slug exists
    const existing = await prisma.category.findUnique({
      where: { slug },
    });

    if (existing) {
      const error = new Error('Category with this name already exists');
      error.statusCode = 400;
      throw error;
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        image,
      },
    });

    return {
      success: true,
      message: 'Category created successfully',
      data: category,
    };
  }

  async update(id, data) {
    const { name, description, image } = data;

    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      const error = new Error('Category not found');
      error.statusCode = 404;
      throw error;
    }

    const updateData = {
      ...(description !== undefined && { description }),
      ...(image !== undefined && { image }),
    };

    if (name && name !== category.name) {
      const slug = generateSlug(name);
      const existing = await prisma.category.findUnique({
        where: { slug },
      });

      if (existing && existing.id !== id) {
        const error = new Error('Category with this name already exists');
        error.statusCode = 400;
        throw error;
      }

      updateData.name = name;
      updateData.slug = slug;
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: updateData,
    });

    return {
      success: true,
      message: 'Category updated successfully',
      data: updatedCategory,
    };
  }

  async delete(id) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      const error = new Error('Category not found');
      error.statusCode = 404;
      throw error;
    }

    if (category._count.products > 0) {
      const error = new Error('Cannot delete category with existing products');
      error.statusCode = 400;
      throw error;
    }

    await prisma.category.delete({
      where: { id },
    });

    return {
      success: true,
      message: 'Category deleted successfully',
    };
  }
}

module.exports = new CategoriesService();
