"use client";

import type { ProductVariant } from "@/types/product";

type VariantSelectorsProps = {
    variants: ProductVariant[];
    selectedVariant: ProductVariant;
    onChange: (variant: ProductVariant) => void;
};

export default function VariantSelectors({
    variants,
    selectedVariant,
    onChange,
}: VariantSelectorsProps) {
    const attributeNames = Array.from(
        new Set(
            variants.flatMap((variant) =>
                Object.keys(variant.attributes || {})
            )
        )
    );

    return (
        <div className="space-y-5">
            {selectedVariant.colorName && (
                <div>
                    <p className="mb-2 text-sm font-semibold">Color</p>

                    <div className="flex flex-wrap gap-2">
                        {variants
                            .filter((variant) => variant.colorName)
                            .map((variant) => {
                                const selected =
                                    variant.id === selectedVariant.id;

                                return (
                                    <button
                                        key={variant.id}
                                        onClick={() => onChange(variant)}
                                        className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${selected
                                                ? "border-[var(--primary)] bg-[var(--primary-light)]"
                                                : "border-[var(--border)] bg-white"
                                            }`}
                                    >
                                        {variant.colorHex && (
                                            <span
                                                className="h-4 w-4 rounded-full border border-gray-200"
                                                style={{
                                                    backgroundColor: variant.colorHex,
                                                }}
                                            />
                                        )}

                                        {variant.colorName}
                                    </button>
                                );
                            })}
                    </div>
                </div>
            )}

            {attributeNames.map((attribute) => {
                const values = Array.from(
                    new Set(
                        variants
                            .map((variant) => variant.attributes?.[attribute])
                            .filter(Boolean)
                    )
                );

                return (
                    <div key={attribute}>
                        <p className="mb-2 text-sm font-semibold">{attribute}</p>

                        <select
                            value={selectedVariant.attributes?.[attribute] || ""}
                            onChange={(event) => {
                                const value = event.target.value;

                                const variant = variants.find(
                                    (item) =>
                                        item.attributes?.[attribute] === value
                                );

                                if (variant) {
                                    onChange(variant);
                                }
                            }}
                            className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 text-sm outline-none focus:border-[var(--primary)]"
                        >
                            {values.map((value) => (
                                <option key={value} value={value}>
                                    {value}
                                </option>
                            ))}
                        </select>
                    </div>
                );
            })}
        </div>
    );
}