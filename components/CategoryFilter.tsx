"use client";

import type { Category } from "@/types/product";

type CategoryFilterProps = {
    categories: Category[];
    selected: string;
    onChange: (slug: string) => void;
};

export default function CategoryFilter({
    categories,
    selected,
    onChange,
}: CategoryFilterProps) {
    return (
        <div className="flex gap-2 overflow-x-auto pb-2">
            <button
                onClick={() => onChange("")}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${selected === ""
                        ? "bg-[var(--primary)] text-white"
                        : "bg-[var(--surface-muted)] text-[var(--text-secondary)] hover:bg-[var(--primary-light)]"
                    }`}
            >
                All
            </button>

            {categories.map((category) => (
                <button
                    key={category.id}
                    onClick={() => onChange(category.slug)}
                    className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${selected === category.slug
                            ? "bg-[var(--primary)] text-white"
                            : "bg-[var(--surface-muted)] text-[var(--text-secondary)] hover:bg-[var(--primary-light)]"
                        }`}
                >
                    {category.name}
                </button>
            ))}
        </div>
    );
}