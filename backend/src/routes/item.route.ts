import { Router } from "express";
import { ItemsController } from '../controllers/item.controller';

const router = Router();
const itemsController = new ItemsController();

router.get("/", (req, res, next) => itemsController.index(req, res, next));
router.get("/:id", (req, res, next) => itemsController.find(req, res, next));

export default router;
