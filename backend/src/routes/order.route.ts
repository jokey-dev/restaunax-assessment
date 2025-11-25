import { Router } from "express";
import { OrdersController } from '../controllers/order.controller';
import { validate } from '../middlewares/validate.middleware';
import { createOrderSchema, updateOrderSchema } from '../validations/order.validation';

const router = Router();
const ordersController = new OrdersController();

router.get('/stats', (req, res, next) => ordersController.stats(req, res, next));
router.get("/", (req, res, next) => ordersController.index(req, res, next));
router.get("/:id", (req, res, next) => ordersController.find(req, res, next));
router.post("/", validate(createOrderSchema), (req, res, next) => ordersController.create(req, res, next));
router.patch("/:id", validate(updateOrderSchema), (req, res, next) => ordersController.update(req, res, next));
router.delete("/:id", (req, res, next) => ordersController.delete(req, res, next));

export default router;
