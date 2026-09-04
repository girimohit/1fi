"use client";

import type { ProductVariant } from "@/types/product";

type VariantSelectorsProps = {
    variants: ProductVariant[];
    selectedVariant: ProductVariant;
    onChange: (variant: ProductVariant) => void;
};

export default function VariantSelector({
    variants,
    selectedVariant,
    onChange,
}: VariantSelectorsProps) {
    const attributes = Array.from(
        new Set(
            variants.flatMap((variant) =>
                Object.keys(variant.attributes || {})
            )
        )
    );

    function getAvailableVariants(attribute: string, value: string) {
        return variants.filter(
            (variant) => variant.attributes?.[attribute] === value
        );
    }

    function selectAttribute(attribute: string, value: string) {
        const exactMatch = variants.find((variant) => {
            if (variant.attributes?.[attribute] !== value) {
                return false;
            }

            return Object.entries(selectedVariant.attributes || {}).every(
                ([key, currentValue]) => {
                    if (key === attribute) {
                        return currentValue === value;
                    }

                    return variant.attributes?.[key] === currentValue;
                }
            );
        });

        if (exactMatch) {
            onChange(exactMatch);
            return;
        }

        const fallback = getAvailableVariants(attribute, value)[0];

        if (fallback) {
            onChange(fallback);
        }
    }

    return (
        <div className="space-y-6">
            {selectedVariant.colorName && (
                <div>
                    <p className="mb-3 text-sm font-semibold">
                        Color
                    </p>

                    <div className="flex flex-wrap gap-2">
                        {variants
                            .filter((variant) => variant.colorName)
                            .map((variant) => {
                                const selected =
                                    variant.colorName === selectedVariant.colorName;

                                return (
                                    <button
                                        key={variant.id}
                                        type="button"
                                        onClick={() => onChange(variant)}
                                        className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${selected
                                                ? "border-[var(--primary)] bg-[var(--primary-light)]"
                                                : "border-[var(--border)] bg-white hover:border-[var(--lavender)]"
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

            {attributes.map((attribute) => {
                const values = Array.from(
                    new Set(
                        variants
                            .map(
                                (variant) => variant.attributes?.[attribute]
                            )
                            .filter(Boolean)
                    )
                );

                return (
                    <div key={attribute}>
                        <p className="mb-3 text-sm font-semibold">
                            {attribute}
                        </p>

                        <div className="flex flex-wrap gap-2">
                            {values.map((value) => {
                                const selected =
                                    selectedVariant.attributes?.[attribute] === value;

                                const availableVariants = variants.filter(
                                    (variant) => {
                                        if (
                                            variant.attributes?.[attribute] !== value
                                        ) {
                                            return false;
                                        }

                                        return Object.entries(
                                            selectedVariant.attributes || {}
                                        ).every(([key, currentValue]) => {
                                            if (key === attribute) {
                                                return true;
                                            }

                                            return (
                                                variant.attributes?.[key] ===
                                                currentValue
                                            );
                                        });
                                    }
                                );

                                const available =
                                    availableVariants.length > 0;

                                return (
                                    <button
                                        key={value}
                                        type="button"
                                        disabled={!available}
                                        onClick={() =>
                                            selectAttribute(attribute, value)
                                        }
                                        className={`rounded-lg border px-4 py-2 text-sm transition ${selected
                                                ? "border-[var(--primary)] bg-[var(--primary-light)] font-semibold text-[var(--primary)]"
                                                : available
                                                    ? "border-[var(--border)] bg-white hover:border-[var(--lavender)]"
                                                    : "cursor-not-allowed border-[var(--border)] bg-gray-50 text-gray-300"
                                            }`}
                                    >
                                        {value}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}