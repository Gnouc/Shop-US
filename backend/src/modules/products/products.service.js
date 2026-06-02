const prisma = require('../../database/prisma');
const generateSlug = require('../../utils/generateSlug');

class ProductsService {
  async getAll(query) {
    const {
      page = 1,
      limit = 12,
      categoryId,
      search,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      order = 'desc',
    } = query;

    const skip = (page - 1) * limit;
    const where = {
      status: 'ACTIVE',
      ...(categoryId && { categoryId: parseInt(categoryId) }),
      ...(search && {
        OR: [
          { name: { contains: search } },
          { description: { contains: search } },
          { brand: { contains: search } },
        ],
      }),
      ...(minPrice && { price: { gte: parseFloat(minPrice) } }),
      ...(maxPrice && { price: { lte: parseFloat(maxPrice) } }),
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          images: {
            where: { isPrimary: true },
            take: 1,
          },
        },
        orderBy: { [sortBy]: order },
        skip,
        take: parseInt(limit),
      }),
      prisma.product.count({ where }),
    ]);

    return {
      success: true,
      data: {
        products,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  }

  async getById(id) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: true,
      },
    });

    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }

    return {
      success: true,
      data: product,
    };
  }

  async getBySlug(slug) {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: true,
      },
    });

    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }

    // Get related products
    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        status: 'ACTIVE',
      },
      include: {
        images: {
          where: { isPrimary: true },
          take: 1,
        },
      },
      take: 4,
    });

    return {
      success: true,
      data: {
        product,
        relatedProducts,
      },
    };
  }

  async create(data) {
    const { name, categoryId, description, price, salePrice, stock, brand, origin, images } = data;

    const slug = generateSlug(name);

    // Check if slug exists
    const existing = await prisma.product.findUnique({
      where: { slug },
    });

    if (existing) {
      const error = new Error('Product with this name already exists');
      error.statusCode = 400;
      throw error;
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        categoryId,
        description,
        price,
        salePrice,
        stock: stock || 0,
        brand,
        origin: origin || 'USA',
        status: 'ACTIVE',
        ...(images && {
          images: {
            create: images.map((img, index) => ({
              imageUrl: img.url,
              isPrimary: index === 0,
            })),
          },
        }),
      },
      include: {
        category: true,
        images: true,
      },
    });

    return {
      success: true,
      message: 'Product created successfully',
      data: product,
    };
  }

  async update(id, data) {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }

    const { name, categoryId, description, price, salePrice, stock, brand, origin, images } = data;

    const updateData = {
      ...(categoryId && { categoryId }),
      ...(description !== undefined && { description }),
      ...(price && { price }),
      ...(salePrice !== undefined && { salePrice }),
      ...(stock !== undefined && { stock }),
      ...(brand !== undefined && { brand }),
      ...(origin !== undefined && { origin }),
    };

    if (name && name !== product.name) {
      const slug = generateSlug(name);
      const existing = await prisma.product.findUnique({
        where: { slug },
      });

      if (existing && existing.id !== id) {
        const error = new Error('Product with this name already exists');
        error.statusCode = 400;
        throw error;
      }

      updateData.name = name;
      updateData.slug = slug;
    }

    // Update images if provided
    if (images) {
      await prisma.productImage.deleteMany({
        where: { productId: id },
      });

      updateData.images = {
        create: images.map((img, index) => ({
          imageUrl: img.url,
          isPrimary: index === 0,
        })),
      };
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        images: true,
      },
    });

    return {
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct,
    };
  }

  async updateStatus(id, status) {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { status },
    });

    return {
      success: true,
      message: 'Product status updated successfully',
      data: updatedProduct,
    };
  }

  async delete(id) {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }

    await prisma.product.delete({
      where: { id },
    });

    return {
      success: true,
      message: 'Product deleted successfully',
    };
  }
}

module.exports = new ProductsService();
