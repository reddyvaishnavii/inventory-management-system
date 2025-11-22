// src/pages/Products.tsx
import { Navigation } from "@/components/Navigation";
import { ListCard } from "@/components/ListCard";
import { Package } from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchProducts, createProduct, Product } from "@/api/products";
import { PrimaryButton } from "@/components/PrimaryButton";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const productSchema = z.object({
  name: z.string().min(2, "Name too short"),
  sku: z.string().optional(),
  category: z.string().optional(),
  uom: z.string().optional(),
  stock_total: z.number().min(0).optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

const Products = () => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const qc = useQueryClient();

  // object form for useQuery
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 1000 * 60,
  });

  // object form for useMutation
  const create = useMutation({
    mutationFn: (payload: Partial<Product>) => createProduct(payload),
    onSuccess: (newProduct) => {
      qc.setQueryData(["products"], (old: any) => (old ? [newProduct, ...old] : [newProduct]));
      setOpen(false);
    },
  });

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(query.trim().toLowerCase()) ||
    (p.sku ?? "").toLowerCase().includes(query.trim().toLowerCase())
  );

  const { register, handleSubmit, formState } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: { name: "", sku: "", category: "", uom: "", stock_total: 0 },
  });

  const onSubmit = (data: ProductFormValues) => {
    create.mutate(data);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="md:ml-64 pb-20 md:pb-6">
        <div className="max-w-7xl mx-auto p-6">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-1">Products</h1>
              <p className="text-muted-foreground">Manage your product inventory</p>
            </div>

            <div className="flex items-center gap-3">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or SKU"
                className="px-3 py-2 rounded-md bg-input border border-border text-sm"
              />
              <PrimaryButton onClick={() => setOpen(true)}>Add Product</PrimaryButton>
            </div>
          </div>

          <div className="space-y-3">
            {isLoading && <p className="text-muted-foreground">Loading...</p>}
            {!isLoading && filtered.length === 0 && (
              <p className="text-muted-foreground">No products found. Add one using "Add Product".</p>
            )}

            {filtered.map((product) => (
              <ListCard
                key={product.id}
                title={product.name}
                subtitle={`${product.category ?? "—"} · Stock: ${product.stock_total ?? 0}`}
                icon={<Package size={20} />}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Modal (very small inline modal) */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md bg-card rounded-lg p-6 border border-border">
            <h3 className="text-lg font-semibold mb-4">Add Product</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input {...register("name")} className="w-full px-3 py-2 rounded-md bg-input border border-border" />
                {formState.errors.name && <p className="text-xs text-red-500 mt-1">{formState.errors.name.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">SKU</label>
                  <input {...register("sku")} className="w-full px-3 py-2 rounded-md bg-input border border-border" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <input {...register("category")} className="w-full px-3 py-2 rounded-md bg-input border border-border" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">UoM</label>
                  <input {...register("uom")} className="w-full px-3 py-2 rounded-md bg-input border border-border" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Initial Stock</label>
                  <input type="number" {...register("stock_total", { valueAsNumber: true })} className="w-full px-3 py-2 rounded-md bg-input border border-border" />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2">
                <button type="button" className="px-3 py-2 rounded-md" onClick={() => setOpen(false)}>Cancel</button>
                <PrimaryButton type="submit" disabled={create.isLoading}>
                  {create.isLoading ? "Saving..." : "Save Product"}
                </PrimaryButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
