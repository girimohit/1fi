"use client";

import { useEffect, useState } from "react";

import ProductCard from "@/components/ProductCard";
import CategoryFilter from "@/components/CategoryFilter";
import { getCategories, getProducts } from "@/lib/api";

import type { Category, Product } from "@/types/product";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch {
        setError("Unable to load categories");
      }
    }

    loadCategories();
  }, []);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const data = await getProducts({
          category: selectedCategory || undefined,
        });

        setProducts(data);
      } catch {
        setError("Unable to load products");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [selectedCategory]);

  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-14">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-[var(--primary)]">
            Shop on EMI
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            Find what you need.
          </h1>

          <p className="mt-3 text-[var(--text-secondary)]">
            Shop electronics and everyday essentials with flexible EMI plans.
          </p>
        </div>

        <div className="mt-8">
          <CategoryFilter
            categories={categories}
            selected={selectedCategory}
            onChange={setSelectedCategory}
          />
        </div>

        {error && (
          <div className="mt-8 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-[390px] animate-pulse rounded-2xl bg-[var(--surface-muted)]"
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center text-[var(--text-secondary)]">
            No products...
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}