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

/* ---------------------- PRODUCTS ---------------------- */

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

// ====================== RECEIPTS ROUTES ======================

// GET /receipts → fetch all receipts
app.get("/receipts", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT 
        id,
        receipt_number,
        supplier_name,
        status,
        total_items,
        total_quantity,
        created_at
       FROM receipts
       ORDER BY id DESC`
// GET /warehouses - get all warehouses
app.get("/warehouses", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT 
         w_id AS id,
         w_name AS name,
         w_address AS address
       FROM warehouse
       ORDER BY w_id DESC`
    );

    res.json(rows);
  } catch (err) {
    console.error("GET /receipts error:", err);
    res.status(500).json({ error: "Failed to fetch receipts" });
  }
});

// POST /receipts → create new receipt
app.post("/receipts", async (req, res) => {
  try {
    console.log("POST /receipts received:", req.body);

    const { supplier_name, product_name, quantity } = req.body;

    // Proper validation
    if (!supplier_name || !quantity || quantity <= 0) {
      return res.status(400).json({ error: "Supplier name and valid quantity are required" });
    }

    // Optional: require product_name if you want to update stock
    if (!product_name) {
      return res.status(400).json({ error: "Product name is required to update stock" });
    }

    const receiptNumber = `RCPT-${Date.now()}`;

    // Start transaction for safety
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // 1. Insert receipt
      const [receiptResult] = await connection.query(
        `INSERT INTO receipts 
         (receipt_number, supplier_name, total_items, total_quantity, status) 
         VALUES (?, ?, ?, ?, 'Done')`,
        [receiptNumber, supplier_name, 1, quantity]
      );

      // 2. Update product stock
      const [updateResult] = await connection.query(
        `UPDATE products 
         SET initial_stock = initial_stock + ? 
         WHERE LOWER(TRIM(name)) = LOWER(TRIM(?))`,
        [quantity, product_name]
      );

      if (updateResult.affectedRows === 0) {
        throw new Error(`Product "${product_name}" not found`);
      }

      await connection.commit();

      res.json({
        message: "Receipt created & stock updated successfully",
        receipt_id: receiptResult.insertId,
        receipt_number: receiptNumber,
      });
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error("POST /receipts error:", err);
    res.status(500).json({ 
      error: err.message || "Failed to create receipt" 
    });
  }
});
    console.error("GET /warehouses error:", err);
    res.status(500).json({ error: "Failed to fetch warehouses" });
  }
});

app.post("/warehouses", async (req, res) => {
  try {
    const { name, address } = req.body;

    const [result] = await db.query(
      `INSERT INTO warehouse (w_name, w_address)
       VALUES (?, ?)`,
      [name, address]
    );

    const newId = result.insertId;

    const [rows] = await db.query(
      `SELECT 
         w_id AS id,
         w_name AS name,
         w_address AS address
       FROM warehouse
       WHERE w_id = ?`,
      [newId]
    );

    res.json(rows[0]);
  } catch (err) {
    console.error("POST /warehouses error:", err);
    res.status(500).json({ error: "Failed to create warehouse" });
  }
});

/* ---------------------- ADJUSTMENTS ---------------------- */

// GET /adjustments (MIRRORING warehouse GET STYLE)
app.get("/adjustments", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT 
        a.id,
        a.product_id,
        a.amount,
        a.reason,
        a.type,
        a.date,
        p.name AS product_name,
        p.initial_stock AS current_stock
       FROM adjustments a
       LEFT JOIN products p ON p.product_id = a.product_id
       ORDER BY a.id DESC`
    );

    res.json(rows);
  } catch (err) {
    console.error("GET /adjustments error:", err);
    res.status(500).json({ error: "Failed to fetch adjustments" });
  }
});

// POST /adjustments — identical structure to your /products POST
app.post("/adjustments", async (req, res) => {
  try {
    const { product_id, amount, reason, type } = req.body;

    // 1. Insert into adjustments table
    const [result] = await db.query(
      `INSERT INTO adjustments (product_id, amount, reason, type)
       VALUES (?, ?, ?, ?)`,
      [product_id, amount, reason, type]
    );

    // 2. Update product stock
    await db.query(
      `UPDATE products 
       SET initial_stock = initial_stock + ?
       WHERE product_id = ?`,
      [amount, product_id]
    );

    // 3. Fetch the full new adjustment with product_name
    const [rows] = await db.query(
      `SELECT 
        a.id,
        a.product_id,
        a.amount,
        a.reason,
        a.type,
        a.date,
        p.name AS product_name,
        p.initial_stock AS current_stock
      FROM adjustments a
      LEFT JOIN products p ON p.product_id = a.product_id
      WHERE a.id = ?`,
      [result.insertId]
    );

    res.json(rows[0]);
  } catch (err) {
    console.error("POST /adjustments error:", err);
    res.status(500).json({ error: "Failed to create adjustment" });
  }
});

/* ---------------------- START SERVER ---------------------- */

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
