import { Router } from "express";
import { validate } from "../middleware/validate";
import { loginSchema, signupSchema } from "../validation/authSchema";
import { login, me, signup } from "../controllers/authController";
import { auth } from "../middleware/auth";


const router = Router();

router.post('/signup', validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login)
router.get("/me", auth, me);

export default router;