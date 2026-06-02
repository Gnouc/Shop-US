const prisma = require('../../database/prisma');
const generateOrderCode = require('../../utils/generateOrderCode');

class OrdersService {
  async create(userId, data) {
    const { customerName, phone, address, note } = data;

    // Get cart items
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      const error = new Error('Cart is empty');
      error.statusCode = 400;
      throw error;
    }

    // Check stock availability
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        const error = new Error(`Insufficient stock for ${item.product.name}`);
        error.statusCode = 400;
        throw error;
      }
    }

    // Calculate total
    const totalAmount = cart.items.reduce((sum, item) => {
      const price = item.product.salePrice || item.product.price;
      return sum + Number(price) * item.quantity;
    }, 0);

    // Create order
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId,
          orderCode: generateOrderCode(),
          customerName,
          phone,
          address,
          totalAmount,
          status: 'PENDING',
          note,
          paymentMethod: 'COD',
          paymentStatus: 'UNPAID',
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              productName: item.product.name,
              price: item.product.salePrice || item.product.price,
              quantity: item.quantity,
              total: (item.product.salePrice || item.product.price) * item.quantity,
            })),
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      // Update product stock
      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });

        // Log inventory
        await tx.inventoryLog.create({
          data: {
            productId: item.productId,
            type: 'OUT',
            quantity: -item.quantity,
            note: `Order ${newOrder.orderCode}`,
          },
        });
      }

      // Clear cart
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return newOrder;
    });

    return {
      success: true,
      message: 'Order created successfully',
      data: order,
    };
  }

  async getMyOrders(userId, query) {
    const { page = 1, limit = 10, status } = query;
    const skip = (page - 1) * limit;

    const where = {
      userId,
      ...(status && { status }),
    };

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  images: {
                    where: { isPrimary: true },
                    take: 1,
                  },
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
      }),
      prisma.order.count({ where }),
    ]);

    return {
      success: true,
      data: {
        orders,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  }

  async getOrderById(userId, orderId) {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
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

    if (!order) {
      const error = new Error('Order not found');
      error.statusCode = 404;
      throw error;
    }

    return {
      success: true,
      data: order,
    };
  }

  async cancelOrder(userId, orderId) {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      const error = new Error('Order not found');
      error.statusCode = 404;
      throw error;
    }

    if (!['PENDING', 'CONFIRMED'].includes(order.status)) {
      const error = new Error('Cannot cancel this order');
      error.statusCode = 400;
      throw error;
    }

    // Update order and restore stock
    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: orderId },
        data: { status: 'CANCELLED' },
      });

      // Restore stock
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        });

        await tx.inventoryLog.create({
          data: {
            productId: item.productId,
            type: 'IN',
            quantity: item.quantity,
            note: `Order ${order.orderCode} cancelled`,
          },
        });
      }
    });

    return {
      success: true,
      message: 'Order cancelled successfully',
    };
  }

  // Admin methods
  async getAllOrders(query) {
    const { page = 1, limit = 20, status, search } = query;
    const skip = (page - 1) * limit;

    const where = {
      ...(status && { status }),
      ...(search && {
        OR: [
          { orderCode: { contains: search } },
          { customerName: { contains: search } },
          { phone: { contains: search } },
        ],
      }),
    };

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
      }),
      prisma.order.count({ where }),
    ]);

    return {
      success: true,
      data: {
        orders,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  }

  async updateOrderStatus(orderId, status) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      const error = new Error('Order not found');
      error.statusCode = 404;
      throw error;
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: {
        items: true,
      },
    });

    return {
      success: true,
      message: 'Order status updated successfully',
      data: updatedOrder,
    };
  }
}

module.exports = new OrdersService();
