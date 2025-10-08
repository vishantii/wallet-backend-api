import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config();

// Create a SQL Connection using our DB URL
export const sql = neon(process.env.DATABASE_URL);

export const initDB = async () => {
  try {
    await sql`CREATE TABLE IF NOT EXISTS transactions(
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      title VARCHAR(255) NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      category VARCHAR(255) NOT NULL,
      created_at DATE NOT NULL DEFAULT CURRENT_DATE
      )`;

    console.log("Database initialize successfully");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
