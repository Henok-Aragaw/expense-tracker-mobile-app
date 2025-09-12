import { Router } from "express";
import { createExpense, getExpense, listExpense } from "../controllers/expensesController";
import { validate } from "../middleware/validate";
import { createExpenseSchema } from "../validation/expenseSchemas";
import { auth } from "../middleware/auth";


const router = Router();

router.use(auth);

router.post('/', validate(createExpenseSchema), createExpense);
router.get("/:id", getExpense);
router.get("/", listExpense);

export default router;