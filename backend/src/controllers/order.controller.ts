import { NextFunction, Request, Response } from "express";
import { Order } from '../../prisma/generated/client';
import { OrderService } from "../services/order.service";
import { PaginatedResult } from '../utils/pagination.util';
import * as apiResponse from "../utils/response.util";

export class OrdersController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  public async index(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const result: PaginatedResult<Order> = await this.orderService.findAll(req);
      return apiResponse.paginatedData(
        res,
        "Orders fetched successfully",
        result.data,
        result.pagination.page,
        result.pagination.limit,
        result.pagination.total
      );
    } catch (error) {
      next(error);
    }
  }

  public async find(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const orderId = Number(req.params.id);
      const data: Order | null = await this.orderService.findById(orderId);

      if (!data) {
        return apiResponse.notFound(res, `Order with id '${orderId}' does not exist`);
      }

      return apiResponse.successData(res, "Order fetched successfully", data);
    } catch (error) {
      next(error);
    }
  }

  public async create(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const data = await this.orderService.store(req);

      //emit new order to socket
      // this.socketService.emitNewOrder(data);

      return apiResponse.recordCreated(res, "Order has been created", data);
    } catch (error) {
      next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      await this.orderService.edit(req);
      return apiResponse.success(res, "Order status has been updated");
    } catch (error) {
      next(error);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const orderId = Number(req.params.id);
      const existingOrder = await this.orderService.findById(orderId);

      if (!existingOrder) {
        return apiResponse.notFound(res, `Order with id '${orderId}' does not exist`);
      }

      const deleted = await this.orderService.remove(orderId);
      if (deleted) {
        return apiResponse.success(res, "Order has been deleted");
      }

      return apiResponse.Error(res, "Order has not been deleted");
    } catch (error) {
      next(error);
    }
  }

  public async stats(_req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const stats = await this.orderService.stats();
      return apiResponse.successData(res, "Order statistics fetched successfully", stats);
    } catch (error) {
      next(error);
    }
  }
}
