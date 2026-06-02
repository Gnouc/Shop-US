const prisma = require('../../database/prisma');

class CartsService {
  async getCart(userId) {
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: {
                  where: { isPrimary: true },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: {
                    where: { isPrimary: true },
                    take: 1,
                  },
                },
              },
            },
          },
        },
      });
    }

    // Calculate totals
    const subtotal = cart.items.reduce((sum, item) => {
      const price = item.product.salePrice || item.product.price;
      return sum + Number(price) * item.quantity;
    }, 0);

    return {
      success: true,
      data: {
        cart,
        summary: {
          subtotal,
          itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
        },
      },
    };
  }

  async addItem(userId, data) {
    const { productId, quantity = 1 } = data;

    // Check product exists and has stock
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }

    if (product.status !== 'ACTIVE') {
      const error = new Error('Product is not available');
      error.statusCode = 400;
      throw error;
    }

    if (product.stock < quantity) {
      const error = new Error('Insufficient stock');
      error.statusCode = 400;
      throw error;
    }

    // Get or create cart
    let cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
      });
    }

    // Check if item already in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      
      if (product.stock < newQuantity) {
        const error = new Error('Insufficient stock');
        error.statusCode = 400;
        throw error;
      }

      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }

    return this.getCart(userId);
  }

  async updateItem(userId, itemId, quantity) {
    if (quantity < 1) {
      const error = new Error('Quantity must be at least 1');
      error.statusCode = 400;
      throw error;
    }

    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart: { userId },
      },
      include: { product: true },
    });

    if (!cartItem) {
      const error = new Error('Cart item not found');
      error.statusCode = 404;
      throw error;
    }

    if (cartItem.product.stock < quantity) {
      const error = new Error('Insufficient stock');
      error.statusCode = 400;
      throw error;
    }

    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });

    return this.getCart(userId);
  }

  async removeItem(userId, itemId) {
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart: { userId },
      },
    });

    if (!cartItem) {
      const error = new Error('Cart item not found');
      error.statusCode = 404;
      throw error;
    }

    await prisma.cartItem.delete({
      where: { id: itemId },
    });

    return {
      success: true,
      message: 'Item removed from cart',
    };
  }

  async clearCart(userId) {
    const cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    }

    return {
      success: true,
      message: 'Cart cleared',
    };
  }
}

module.exports = new CartsService();
