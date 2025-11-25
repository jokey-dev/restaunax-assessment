import { Request } from "express";
import { Order, OrderStatus } from '../../prisma/generated/client';
import { generateOrderNumber } from "../utils/order.util";
import {
  PaginatedResult,
  paginate,
  setupPagination,
} from "../utils/pagination.util";
import { prisma } from '../utils/prisma-client.util';
import { SocketService } from './socket.service';

export class OrderService {
  private socketService: SocketService;

  constructor() {
    this.socketService = SocketService.getInstance();
  }

  public async findAll(req: Request): Promise<PaginatedResult<Order>> {
    const { page, limit, skip } = setupPagination(
      parseInt(req.query.page as string) || 1,
      parseInt(req.query.limit as string) || 10
    );

    const statusFilter = req.query.status as OrderStatus | undefined;

    try {
      const [totalOrders, orders]: [number, Order[]] = await Promise.all([
        prisma.order.count({
          where: statusFilter ? { status: statusFilter } : {},
        }),
        prisma.order.findMany({
          where: statusFilter ? { status: statusFilter } : {},
          skip,
          take: limit,
          include: {
            items: {
              include: {
                item: true
              }
            }
          },
          orderBy: { createdAt: "desc" },
        }),
      ]);

      return {
        data: orders,
        pagination: paginate(totalOrders, page, limit),
      };
    } catch (error) {
      throw error;
    }
  }

  public async findById(id: number): Promise<Order | null> {
    try {
      const order = await prisma.order.findUnique({
        where: { id },
        include: {
          items: {
            include: {
              item: true,
            },
          },
        },
      });

      return order;
    } catch (error) {
      throw error;
    }
  }

  public async store(req: Request): Promise<Order | void> {
    try {
      const {
        customerName,
        customerEmail,
        customerPhone,
        customerRewardPoints,
        orderType,
        items,
      } = req.body;

      const total = items.reduce(
        (
          sum: number,
          oi: { itemId: number; quantity: number; price: number }
        ) => {
          return sum + oi.quantity * oi.price;
        },
        0
      );

      const order = await prisma.order.create({
        data: {
          customerName,
          customerEmail,
          customerPhone,
          orderNumber: generateOrderNumber(),
          customerRewardPoints,
          orderType,
          total,
          items: {
            create: items,
          },
        },
        include: {
          items: true,
        },
      });

      //emit new order event to socket
      this.socketService.emitOrderCreated(order);

      return order;
    } catch (error) {
      throw error;
    }
  }

  public async edit(req: Request): Promise<Order | void> {
    try {
      const orderId = Number(req.params.id);
      const { status } = req.body;

      const order = await prisma.order.update({
        where: { id: orderId },
        data: { status },
        include: { items: true }
      });

      return order;
    } catch (error) {
      throw error;
    }
  }

  public async remove(orderId: number): Promise<Order | void> {
    try {
      await prisma.orderItem.deleteMany({
        where: { orderId }
      });

      const deletedOrder = await prisma.order.delete({
        where: { id: orderId },
      });

      return deletedOrder;
    } catch (error) {
      throw error;
    }
  }

  public async stats(): Promise<OrderStats> {
    try {
      const stats = await prisma.order.groupBy({
        by: ['status'],
        _count: {
          status: true,
        },
        _sum: {
          total: true
        },
      });

      const formattedStats = stats.reduce((acc: any, item: any) => {
        acc[item.status] = {
          count: item._count.status,
          totalAmount: item._sum.total || 0,
        };
        return acc;
      }, {});

      const totalOrders = await prisma.order.count();
      const totalSales = await prisma.order.aggregate({
        _sum: {
          total: true,
        },
      });

      return {
        totalOrders,
        totalSales: totalSales._sum.total || 0,
        stats: formattedStats,
      };
    } catch (error) {
      throw error;
    }
  }
}
