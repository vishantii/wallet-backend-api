import { sql } from "../config/db.js";

const getTransactionByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const transactions =
      await sql`SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC`;

    res.status(200).json(transactions);
  } catch (error) {
    console.log("Error getting the transactions", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const createTransaction = async (req, res) => {
  try {
    const { title, amount, category, user_id } = req.body;

    if (!title || amount === undefined || !category || !user_id) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const transaction =
      await sql`INSERT INTO transactions (title, amount, category, user_id) VALUES (${title}, ${amount}, ${category}, ${user_id}) RETURNING *`;

    console.log("Transaction created successfully", transaction);
    res.status(201).json(transaction);
  } catch (error) {
    console.log("Error creating the transactions", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(parseInt(id)))
      return res.status(400).json({ message: "Invalid transaction ID" });

    const result =
      await sql`DELETE FROM transactions WHERE id = ${id} RETURNING *`;

    if (result.length === 0) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.status(200).json(result);
    console.log("Transaction deleted successfully", result);
  } catch (error) {
    console.log("Error getting the transactions", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getSummaryTransaction = async (req, res) => {
  try {
    const { userId } = req.params;

    const balanceResult =
      await sql`SELECT COALESCE(SUM(amount),0) as balance FROM transactions WHERE user_id = ${userId}`;

    const incomeResult =
      await sql`SELECT COALESCE(SUM(amount),0) as income FROM transactions WHERE user_id = ${userId} AND amount > 0`;

    const expenseResult =
      await sql`SELECT COALESCE(SUM(amount),0) as expense FROM transactions WHERE user_id = ${userId} AND amount < 0`;

    res.status(200).json({
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expense: expenseResult[0].expense,
    });
  } catch (error) {
    console.log("Error getting the summary", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export {
  getTransactionByUserId,
  createTransaction,
  deleteTransaction,
  getSummaryTransaction,
};
