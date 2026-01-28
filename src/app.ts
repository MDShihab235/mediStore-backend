import express from "express";

import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { medicineRouter } from "./modules/medicines/medicines.routes";

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

app.get("/", (req, res) => {
  res.send("This is Medi Store backend");
});

export default app;
