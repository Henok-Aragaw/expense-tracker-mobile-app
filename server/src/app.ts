import express from 'express';
import cors from "cors"
import { errorHandler } from './middleware/errorHandler';

//Routes
import authRoutes from "./routes/auth"
import expenseRoutes from './routes/expenses';

const app = express();

app.use(express.json());
app.use(cors())

//API ROUTES
app.use("/api/auth", authRoutes);
app.use('/api/expenses', expenseRoutes);

app.get('/health', (_, res) => res.json({ status: 'OK'}));

app.use(errorHandler)

export default app;