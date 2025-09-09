import express from 'express';
import { errorHandler } from './middleware/errorHandler';


const app = express();

app.use(express.json());

app.get('/health', (_, res) => res.json({ status: 'OK'}));

app.use(errorHandler)

export default app;