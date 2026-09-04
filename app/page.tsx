"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, PackageOpen } from "lucide-react";

import ProductCard from "@/components/ProductCard";
import CategoryFilter from "@/components/CategoryFilter";
import { getCategories, getProducts } from "@/lib/api";
import type { Category, Product } from "@/types/product";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const [productData, categoryData] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);

        setProducts(productData);
        setCategories(categoryData);
      } catch {
        setError("Unable to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const categoryMatch =
        !selectedCategory ||
        product.category?.slug === selectedCategory;

      const searchTerm = search.trim().toLowerCase();

      const searchMatch =
        !searchTerm ||
        product.name.toLowerCase().includes(searchTerm) ||
        product.brand.toLowerCase().includes(searchTerm) ||
        product.category?.name.toLowerCase().includes(searchTerm);

      return categoryMatch && searchMatch;
    });
  }, [products, selectedCategory, search]);

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <section className="border-b border-[var(--border)] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-[var(--primary)]">
              Shop on EMI
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
              Find what you need.
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--text-secondary)] sm:text-base">
              Shop electronics and everyday essentials with flexible EMI
              plans.
            </p>
          </div>

          <div className="mt-7 max-w-2xl">
            <div className="flex h-11 items-center rounded-lg border border-[var(--border)] bg-[var(--gray)] px-3 focus-within:border-[var(--primary)] focus-within:bg-white">
              <Search
                size={18}
                className="shrink-0 text-[var(--text-muted)]"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search products or brands..."
                className="ml-2 w-full bg-transparent text-sm outline-none placeholder:text-[var(--text-muted)]"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal
              size={17}
              className="text-[var(--text-muted)]"
            />

            <h2 className="text-sm font-semibold sm:text-base">
              Categories
            </h2>
          </div>

          {!loading && (
            <p className="text-xs text-[var(--text-muted)] sm:text-sm">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "product" : "products"}
            </p>
          )}
        </div>

        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onChange={setSelectedCategory}
        />

        {error ? (
          <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-sm font-medium text-red-700">{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Retry
            </button>
          </div>
        ) : loading ? (
          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-xl border border-[var(--border)] bg-white"
              >
                <div className="aspect-square animate-pulse bg-[var(--gray)]" />

                <div className="space-y-3 p-4">
                  <div className="h-3 w-16 animate-pulse rounded bg-[var(--gray)]" />
                  <div className="h-5 w-full animate-pulse rounded bg-[var(--gray)]" />
                  <div className="h-5 w-24 animate-pulse rounded bg-[var(--gray)]" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="mt-10 flex flex-col items-center rounded-xl border border-dashed border-[var(--border)] bg-white px-6 py-14 text-center">
            <PackageOpen
              size={32}
              className="text-[var(--text-muted)]"
            />

            <h3 className="mt-4 font-semibold">
              No products found
            </h3>

            <p className="mt-1 max-w-sm text-sm text-[var(--text-muted)]">
              Try a different search or select another category.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedCategory("");
              }}
              className="mt-4 text-sm font-semibold text-[var(--primary)]"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}