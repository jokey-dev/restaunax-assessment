import { NextFunction, Request, Response } from "express";
import { ItemService } from '../services/item.service';
import { PaginatedResult } from '../utils/pagination.util';
import * as apiResponse from "../utils/response.util";
import { Item } from '../../prisma/generated/client';

export class ItemsController {
  private itemService: ItemService;

  constructor() {
    this.itemService = new ItemService();
  }

  public async index(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const result: PaginatedResult<Item> = await this.itemService.findAll(req);
      return apiResponse.paginatedData(
        res,
        "Items fetched successfully",
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
      const data: Item | null = await this.itemService.findById(orderId);

      if (!data) {
        return apiResponse.notFound(res, `Item with id '${orderId}' does not exist`);
      }

      return apiResponse.successData(res, "Item fetched successfully", data);
    } catch (error) {
      next(error);
    }
  }
}
