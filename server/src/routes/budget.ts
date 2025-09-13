import { Router } from "express";
import { setBudget, getBudget, updateBudget } from "../controllers/budgetController";
import { auth } from "../middleware/auth";

const router = Router();

router.use(auth);

router.post("/", setBudget);
router.get("/", getBudget);
router.put("/", updateBudget); 
export default router;
