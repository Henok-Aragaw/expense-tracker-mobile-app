import mongoose from "mongoose";
import config from "./index";



export const connectDB = async () => {
    try {
      await mongoose.connect(config.MONGO_URI!);
      console.log("Connected to MongoDB");  
    } catch (error) {
       console.error('❌ MongoDB connection error:', error);
       process.exit(1);
    }
}