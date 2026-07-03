// Loads and normalizes environment configuration.
import dotenv from "dotenv";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  isProduction,
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/velora_ecommerce",
  jwtSecret: process.env.JWT_SECRET || "development_only_change_me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  cloudinary: {
    cloudName: process.env.CLOUDINARY_NAME || "",
    apiKey: process.env.CLOUDINARY_KEY || "",
    apiSecret: process.env.CLOUDINARY_SECRET || "",
  },
};

if (isProduction && env.jwtSecret === "development_only_change_me") {
  throw new Error("JWT_SECRET must be set in production.");
}
