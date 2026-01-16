import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;

export const db = new Pool({
  connectionString,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

const testConnection = async () => {
  try {
    const res = await db.query("SELECT NOW()");
    console.log("✅ Database connected at:", res.rows[0].now);
  } catch (err) {
    console.error("❌ Database connection error:", err.message);
  }
};
testConnection();
console.log("DATABASE_URL:", process.env.DATABASE_URL);
