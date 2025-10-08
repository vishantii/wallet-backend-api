import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";
import rateLimiter from "./middleware/ratelimitter.js";
import transactionsRoute from "./routes/transactionsRoute.js";
import job from "./config/cron.js";

dotenv.config();
const app = express();
const PORT = process.env.DATABASE_PORT || 5001;

if (process.env.NODE_ENV === "production") job.start();

// Middleware
app.use(
  cors({
    origin: "*", // Allow all origins (for development)
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);
app.use(rateLimiter);
app.use(express.json());

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Wallet Tracker API is running" });
});

app.use("/api/transactions", transactionsRoute);

initDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is running on PORT:", PORT);
  });
});
