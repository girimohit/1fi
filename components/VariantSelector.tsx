"use client";

import { Check, ChevronDown } from "lucide-react";
import type { ProductVariant } from "@/types/product";

type VariantSelectorProps = {
    variants: ProductVariant[];
    selectedVariant: ProductVariant;
    onChange: (variant: ProductVariant) => void;
};

export default function VariantSelector({
    variants,
    selectedVariant,
    onChange,
}: VariantSelectorProps) {
    // Unique color options
    const colorVariants = variants.filter(
        (v, idx, arr) =>
            v.colorName &&
            arr.findIndex((o) => o.colorName === v.colorName) === idx
    );

    // Extract dynamic attributes (Storage, RAM, Processor, etc.)
    const attributeKeys = Array.from(
        new Set(
            variants.flatMap((v) => Object.keys(v.attributes || {}))
        )
    );

    function selectColor(colorName: string) {
        // Try to keep current attributes while changing color
        const match =
            variants.find(
                (v) =>
                    v.colorName === colorName &&
                    JSON.stringify(v.attributes) === JSON.stringify(selectedVariant.attributes)
            ) || variants.find((v) => v.colorName === colorName);

        if (match) onChange(match);
    }

    function selectAttribute(key: string, val: string) {
        const match =
            variants.find(
                (v) =>
                    v.colorName === selectedVariant.colorName &&
                    v.attributes?.[key] === val
            ) || variants.find((v) => v.attributes?.[key] === val);

        if (match) onChange(match);
    }

    return (
        <div className="space-y-4">
            {/* Color & Variant Dropdown/Selector Grid */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {/* Color Selector */}
                {colorVariants.length > 0 && (
                    <div className="rounded-xl border border-[var(--border)] bg-white p-3">
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                            Color / Finish
                        </label>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                            {colorVariants.map((v) => {
                                const isSelected = selectedVariant.colorName === v.colorName;
                                return (
                                    <button
                                        key={v.id}
                                        type="button"
                                        onClick={() => selectColor(v.colorName!)}
                                        className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition ${
                                            isSelected
                                                ? "border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)] shadow-2xs"
                                                : "border-[var(--border)] bg-white text-[var(--text-secondary)] hover:border-[var(--lavender)]"
                                        }`}
                                    >
                                        {v.colorHex && (
                                            <span
                                                className="h-3.5 w-3.5 rounded-full border border-black/10 shadow-2xs"
                                                style={{ backgroundColor: v.colorHex }}
                                            />
                                        )}
                                        <span>{v.colorName}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Attributes Selectors (Storage / RAM) */}
                {attributeKeys.map((key) => {
                    const uniqueValues = Array.from(
                        new Set(
                            variants
                                .map((v) => v.attributes?.[key])
                                .filter(Boolean)
                        )
                    );

                    return (
                        <div key={key} className="rounded-xl border border-[var(--border)] bg-white p-3">
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                                {key} Option
                            </label>
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                                {uniqueValues.map((val) => {
                                    const isSelected = selectedVariant.attributes?.[key] === val;
                                    return (
                                        <button
                                            key={val}
                                            type="button"
                                            onClick={() => selectAttribute(key, val)}
                                            className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                                                isSelected
                                                    ? "border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)] shadow-2xs"
                                                    : "border-[var(--border)] bg-white text-[var(--text-secondary)] hover:border-[var(--lavender)]"
                                            }`}
                                        >
                                            {val}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}