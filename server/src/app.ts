import express from 'express';
import cors from "cors"
import { errorHandler } from './middleware/errorHandler';
import authRoutes from "./routes/auth"

const app = express();

app.use(express.json());
app.use(cors())

//API ROUTES
app.use("/api/auth", authRoutes);

app.get('/health', (_, res) => res.json({ status: 'OK'}));

app.use(errorHandler)

export default app;