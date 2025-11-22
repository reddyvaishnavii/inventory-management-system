// src/api/client.ts
export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";

export async function apiGet<T = any>(path: string) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.statusText}`);
  return (await res.json()) as T;
}

export async function apiPost<T = any>(path: string, body: any) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${path} failed: ${res.statusText}`);
  return (await res.json()) as T;
}
