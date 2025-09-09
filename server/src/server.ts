import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import config from "./config";
import { connectDB } from "./config/db";


const startServer = async () => {
    await connectDB();
    app.listen(config.PORT, () => {
        console.log(`🚀 Server running on http://localhost:${config.PORT}`);
    })
}

startServer();