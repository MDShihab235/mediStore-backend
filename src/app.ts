import express from "express";

import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { medicineRouter } from "./modules/medicines/medicines.routes";
import { notFound } from "./middlewares/notFound";
import errorHandler from "./middlewares/globalErrorHandler";
import { ordersRouter } from "./modules/orders/orders.routes";
import { usersRouter } from "./modules/users/users.routes";

const app = express();

// 🔥 REQUIRED for production (Vercel, Render, Railway, etc.)
app.set("trust proxy", 1);

// Configure CORS to allow both production and Vercel preview deployments
const allowedOrigins = [
  process.env.APP_URL || "http://localhost:4000",
  process.env.PROD_APP_URL, // Production frontend URL
  "http://localhost:3000",
  "http://localhost:4000",
  "http://localhost:5000",
  "https://medi-store-frontend-chi.vercel.app",
].filter(Boolean); // Remove undefined values
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      // Check if origin is in allowedOrigins or matches Vercel preview pattern
      const isAllowed =
        allowedOrigins.includes(origin) ||
        /^https:\/\/next-blog-client.*\.vercel\.app$/.test(origin) ||
        /^https:\/\/.*\.vercel\.app$/.test(origin); // Any Vercel deployment

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"],
  }),
);

app.use(express.json());
app.all("/api/auth/*splat", toNodeHandler(auth));

// Adding Routes
app.use("/api/medicines", medicineRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/users", usersRouter);

app.get("/", (req, res) => {
  res.send("This is Medi Store backend");
});

app.use(notFound);
app.use(errorHandler);

export default app;
