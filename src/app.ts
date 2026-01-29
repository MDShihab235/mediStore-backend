import express from "express";

import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { medicineRouter } from "./modules/medicines/medicines.routes";
import { notFound } from "./middlewares/notFound";
import errorHandler from "./middlewares/globalErrorHandler";
import { ordersRouter } from "./modules/orders/orders.routes";

const app = express();

app.use(
  cors({
    origin: process.env.APP_URL || "http://localhost:3000",
    credentials: true,
  }),
);

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

// Adding Routes
app.use("/api/medicines", medicineRouter);
app.use("/api/orders", ordersRouter);

app.get("/", (req, res) => {
  res.send("This is Medi Store backend");
});

app.use(notFound);
app.use(errorHandler);

export default app;
