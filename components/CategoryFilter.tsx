"use client";

import type { Category } from "@/types/product";

type CategoryFilterProps = {
  categories: Category[];
  selectedCategory: string;
  onChange: (slug: string) => void;
};

export default function CategoryFilter({
  categories,
  selectedCategory,
  onChange,
}: CategoryFilterProps) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
      <div className="flex min-w-max gap-2">
        <button
          type="button"
          onClick={() => onChange("")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            selectedCategory === ""
              ? "bg-[var(--primary)] text-white"
              : "border border-[var(--border)] bg-white text-[var(--text-secondary)] hover:border-[var(--lavender)]"
          }`}
        >
          All
        </button>

        {categories.map((category) => {
          const selected = selectedCategory === category.slug;

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onChange(category.slug)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                selected
                  ? "bg-[var(--primary)] text-white"
                  : "border border-[var(--border)] bg-white text-[var(--text-secondary)] hover:border-[var(--lavender)]"
              }`}
            >
              {category.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
