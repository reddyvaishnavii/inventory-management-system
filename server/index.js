import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./db.js";

// Load .env file
dotenv.config();

const app = express();

// Read PORT from .env (fallback to 3000)
const PORT = process.env.PORT || 3000;

// CORS FIX — must NOT use "*" when credentials=true
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:8080",
    credentials: true,
  })
);

app.use(express.json());

// GET /products
app.get("/products", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT 
        product_id AS id,
        name,
        sku,
        category,
        unit_of_measure AS uom,
        initial_stock AS stock_total,
        created_at
       FROM products
       ORDER BY product_id DESC`
    );

    res.json(rows);
  } catch (err) {
    console.error("GET /products error:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// POST /products
app.post("/products", async (req, res) => {
  try {
    console.log("POST /products received:", req.body);

    const { name, sku, category, uom, stock_total } = req.body;

    const [result] = await db.query(
      `INSERT INTO products (name, sku, category, unit_of_measure, initial_stock)
       VALUES (?, ?, ?, ?, ?)`,
      [name, sku ?? null, category ?? null, uom ?? null, stock_total ?? 0]
    );

    const newId = result.insertId;

    const [rows] = await db.query(
      `SELECT 
          product_id AS id, 
          name, 
          sku, 
          category, 
          unit_of_measure AS uom,
          initial_stock AS stock_total, 
          created_at
       FROM products
       WHERE product_id = ?`,
      [newId]
    );

    res.json(rows[0]);
  } catch (err) {
    console.error("POST /products error:", err);
    res.status(500).json({ error: "Failed to create product" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
