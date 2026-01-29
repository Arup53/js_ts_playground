import pool, { query } from "./config/db/db";

async function main() {
  try {
    console.log("🚀 Starting application...\n");

    const res = await query(`
      CREATE TABLE usersNEW(
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      age INT
      )`);

    console.log("table is created", res);
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    // Close the pool
    await pool.end();
    console.log("\n👋 Database connection closed");
  }
}

main();
