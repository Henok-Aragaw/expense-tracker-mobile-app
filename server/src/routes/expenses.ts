import { Router } from "express";
import { createExpense, createRecurring, deleteExpenses, deleteRecurring, getExpense, listExpense, listRecurring, updateExpense, updateRecurring } from "../controllers/expensesController";
import { validate } from "../middleware/validate";
import { createExpenseSchema, createRecurringSchema, updateExpenseSchema } from "../validation/expenseSchemas";
import { auth } from "../middleware/auth";


const router = Router();

router.use(auth);

router.post('/', validate(createExpenseSchema), createExpense);
router.get("/:id", getExpense);
router.get("/", listExpense);
router.put("/:id", validate(updateExpenseSchema), updateExpense)
router.delete('/:id', deleteExpenses);

router.post("/recurring", validate(createRecurringSchema), createRecurring);
router.get("/recurring", listRecurring);
router.put("/recurring/:id", updateRecurring);
router.delete("/recurring/:id", deleteRecurring);


export default router;