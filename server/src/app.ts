import express from 'express';
import cors from "cors"
import { errorHandler } from './middleware/errorHandler';
import "./scheduler/recurringScheduler"

//Routes
import authRoutes from "./routes/auth"
import expenseRoutes from './routes/expenses';
import analyticsRoutes from './routes/analytics';
import budgetRoutes from "./routes/budget";

const app = express();

app.use(express.json());
app.use(cors())

//API ROUTES
app.use("/api/auth", authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use("/api/budget", budgetRoutes);

app.get('/health', (_, res) => res.json({ status: 'OK'}));

app.use(errorHandler)

export default app;