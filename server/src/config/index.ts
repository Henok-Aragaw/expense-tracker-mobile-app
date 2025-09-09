
export default {
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,          
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN , 
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
};
