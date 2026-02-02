import { Pool, PoolConfig } from "pg";

import dotenv from "dotenv";

dotenv.config();

const poolConfig: PoolConfig = {
  user: process.env.POSTGRES_USER || "postgres",
  password: process.env.POSTGRES_PASSWORD || "postgres",
  host: process.env.POSTGRES_HOST || "localhost",
  port: parseInt(process.env.POSTGRES_PORT || "5432"),
  database: process.env.POSTGRES_DB || "postgres",
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection can't be established
};

export const pool = new Pool(poolConfig);

pool.on("connect", () => {
  console.log("Connected  to postgresql db");
});

pool.on("error", (err) => {
  console.log("Error connecting to db", err);
});

export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log("Executed query", { text, duration, rows: res });
    return res;
  } catch (error) {
    console.error("Query error:", error);
    throw error;
  }
};

export default pool;
