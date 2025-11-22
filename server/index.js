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

// GET /products - now includes warehouse information
app.get("/products", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT 
        p.product_id AS id,
        p.name,
        p.sku,
        p.category,
        p.unit_of_measure AS uom,
        p.initial_stock AS stock_total,
        p.warehouse,
        w.w_name AS warehouse_name,
        p.created_at
       FROM products p
       LEFT JOIN warehouse w ON p.warehouse = w.w_id
       ORDER BY p.product_id DESC`
    );

    res.json(rows);
  } catch (err) {
    console.error("GET /products error:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// POST /products - now includes warehouse
app.post("/products", async (req, res) => {
  try {
    const { name, sku, category, uom, stock_total, warehouse } = req.body;

    const [result] = await db.query(
      `INSERT INTO products (name, sku, category, unit_of_measure, initial_stock, warehouse)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, sku ?? null, category ?? null, uom ?? null, stock_total ?? 0, warehouse ?? null]
    );

    const newId = result.insertId;

    const [rows] = await db.query(
      `SELECT 
          p.product_id AS id, 
          p.name, 
          p.sku, 
          p.category, 
          p.unit_of_measure AS uom,
          p.initial_stock AS stock_total,
          p.warehouse,
          w.w_name AS warehouse_name,
          p.created_at
       FROM products p
       LEFT JOIN warehouse w ON p.warehouse = w.w_id
       WHERE p.product_id = ?`,
      [newId]
    );

    res.json(rows[0]);
  } catch (err) {
    console.error("POST /products error:", err);
    res.status(500).json({ error: "Failed to create product" });
  }
});

/* ---------------------- WAREHOUSES ---------------------- */

// GET /warehouses - now includes product count
app.get("/warehouses", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT 
         w.w_id AS id,
         w.w_name AS name,
         w.w_address AS address,
         COUNT(p.product_id) AS product_count
       FROM warehouse w
       LEFT JOIN products p ON p.warehouse = w.w_id
       GROUP BY w.w_id, w.w_name, w.w_address
       ORDER BY w.w_id DESC`
    );

    res.json(rows);
  } catch (err) {
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
         w.w_id AS id,
         w.w_name AS name,
         w.w_address AS address,
         0 AS product_count
       FROM warehouse w
       WHERE w.w_id = ?`,
      [newId]
    );

    res.json(rows[0]);
  } catch (err) {
    console.error("POST /warehouses error:", err);
    res.status(500).json({ error: "Failed to create warehouse" });
  }
});

/* ---------------------- ADJUSTMENTS ---------------------- */

// GET /adjustments
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

// POST /adjustments
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

/* ---------------------- INTERNAL TRANSFERS ---------------------- */

// GET /transfers - now includes product information and status
app.get("/transfers", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT 
        t.transfer_id AS id,
        t.from_location,
        t.to_location,
        t.description,
        t.transfer_date,
        t.prod_id,
        t.status,
        p.name AS product_name,
        t.created_at
       FROM internal_transfer t
       LEFT JOIN products p ON t.prod_id = p.product_id
       ORDER BY t.transfer_id DESC`
    );

    res.json(rows);
  } catch (err) {
    console.error("GET /transfers error:", err);
    res.status(500).json({ error: "Failed to fetch transfers" });
  }
});

// POST /transfers - now includes product ID and status
app.post("/transfers", async (req, res) => {
  try {
    const { from_location, to_location, description, prod_id, status } = req.body;

    // Validate required fields
    if (!from_location || !to_location) {
      return res.status(400).json({ 
        error: "from_location and to_location are required" 
      });
    }

    const [result] = await db.query(
      `INSERT INTO internal_transfer 
       (from_location, to_location, description, prod_id, status, transfer_date, created_at)
       VALUES (?, ?, ?, ?, ?, CURDATE(), CURRENT_TIMESTAMP)`,
      [from_location, to_location, description || null, prod_id || null, status || 'draft']
    );

    const insertId = result.insertId;

    // If status is 'done', update product warehouse
    if (status === 'done' && prod_id) {
      await db.query(
        `UPDATE products SET warehouse = ? WHERE product_id = ?`,
        [to_location, prod_id]
      );
    }

    // Fetch the newly created transfer with product info
    const [rows] = await db.query(
      `SELECT 
        t.transfer_id AS id,
        t.from_location,
        t.to_location,
        t.description,
        t.transfer_date,
        t.prod_id,
        t.status,
        p.name AS product_name,
        t.created_at
       FROM internal_transfer t
       LEFT JOIN products p ON t.prod_id = p.product_id
       WHERE t.transfer_id = ?`,
      [insertId]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("POST /transfers error:", err);
    res.status(500).json({ error: "Failed to create transfer", details: err.message });
  }
});

// PATCH /transfers/:id/status - update transfer status
app.patch("/transfers/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    // Get transfer details first
    const [transfers] = await db.query(
      `SELECT prod_id, to_location FROM internal_transfer WHERE transfer_id = ?`,
      [id]
    );

    if (transfers.length === 0) {
      return res.status(404).json({ error: "Transfer not found" });
    }

    const transfer = transfers[0];

    // Update status
    await db.query(
      `UPDATE internal_transfer SET status = ? WHERE transfer_id = ?`,
      [status, id]
    );

    // If status changed to 'done', update product warehouse
    if (status === 'done' && transfer.prod_id) {
      await db.query(
        `UPDATE products SET warehouse = ? WHERE product_id = ?`,
        [transfer.to_location, transfer.prod_id]
      );
    }

    // Fetch updated transfer to return
    const [updatedRows] = await db.query(
      `SELECT 
        t.transfer_id AS id,
        t.from_location,
        t.to_location,
        t.description,
        t.transfer_date,
        t.prod_id,
        t.status,
        p.name AS product_name,
        t.created_at
       FROM internal_transfer t
       LEFT JOIN products p ON t.prod_id = p.product_id
       WHERE t.transfer_id = ?`,
      [id]
    );

    res.json(updatedRows[0]);
  } catch (err) {
    console.error("PATCH /transfers/:id/status error:", err);
    res.status(500).json({ error: "Failed to update status", details: err.message });
  }
});

// PATCH /products/:id/update-warehouse - update product warehouse
app.patch("/products/:id/update-warehouse", async (req, res) => {
  try {
    const { id } = req.params;
    const { warehouse } = req.body;

    await db.query(
      `UPDATE products SET warehouse = ? WHERE product_id = ?`,
      [warehouse, id]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("PATCH /products/:id/update-warehouse error:", err);
    res.status(500).json({ error: "Failed to update product warehouse" });
  }
});

/* ---------------------- START SERVER ---------------------- */

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});