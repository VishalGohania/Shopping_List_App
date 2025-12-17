import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { createItem, deleteItem, getItem, updateItem } from "../controllers/itemController.js";


const router = Router();

router.use(authenticate);

router.get('/', getItem);
router.post('/', createItem);
router.put('/:id', updateItem);
router.delete('/:id', deleteItem);

export default router;