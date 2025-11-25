import { Request } from "express";
import { Item } from '../../prisma/generated/client';
import {
  PaginatedResult,
  paginate,
  setupPagination,
} from "../utils/pagination.util";
import { prisma } from '../utils/prisma-client.util';

export class ItemService {
  public async findAll(req: Request): Promise<PaginatedResult<Item>> {
    const { page, limit, skip } = setupPagination(
      parseInt(req.query.page as string) || 1,
      parseInt(req.query.limit as string) || 10
    );

    try {
      const [totalItems, items]: [number, Item[]] = await Promise.all([
        prisma.item.count(),
        prisma.item.findMany({
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
        }),
      ]);

      return {
        data: items,
        pagination: paginate(totalItems, page, limit),
      };
    } catch (error) {
      throw error;
    }
  }

  public async findById(id: number): Promise<Item | null> {
    try {
      const item = await prisma.item.findUnique({
        where: { id }
      });

      return item;
    } catch (error) {
      throw error;
    }
  }
}
