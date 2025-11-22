// src/api/products.ts
import { apiGet, apiPost } from "./client";

export type Product = {
  id: string | number;
  name: string;
  sku?: string;
  category?: string;
  uom?: string;
  stock_total?: number;
  stock_by_location?: { warehouseId: string; qty: number }[];
};

const MOCK_PRODUCTS: Product[] = [
  { id: "p1", name: "Steel Rods", category: "Raw Materials", sku: "SRD-001", stock_total: 120 },
  { id: "p2", name: "Wooden Chairs", category: "Furniture", sku: "CH-010", stock_total: 55 },
  { id: "p3", name: "Plastic Pipes", category: "Plumbing", sku: "PP-013", stock_total: 210 },
];

export async function fetchProducts(): Promise<Product[]> {
  try {
    const data = await apiGet<Product[]>("/products");
    return data;
  } catch (e) {
    // fallback to mock if backend not reachable
    return new Promise((res) => setTimeout(() => res(MOCK_PRODUCTS), 200));
  }
}

export async function createProduct(payload: Partial<Product>): Promise<Product> {
  try {
    const data = await apiPost<Product>("/products", payload);
    return data;
  } catch (e) {
    // fallback: fabricate an ID and return
    const fake: Product = {
      id: `local-${Date.now()}`,
      name: payload.name || "Unnamed",
      sku: payload.sku,
      category: payload.category,
      uom: payload.uom,
      stock_total: payload.stock_total ?? 0,
    };
    return fake;
  }
}
