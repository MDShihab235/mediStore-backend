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
  "http://localhost:3000",
  "http://localhost:4000",
  "https://medi-store-frontend-chi.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, origin); // 👈 IMPORTANT
      }

      callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
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
