import express from "express";
import {
  getTransactionByUserId,
  createTransaction,
  deleteTransaction,
  getSummaryTransaction,
} from "../controllers/transactionsController.js";

const router = express.Router();

router.post("/", createTransaction);

router.get("/:userId", getTransactionByUserId);

router.delete("/:id", deleteTransaction);

router.get("/summary/:userId", getSummaryTransaction);

export default router;
