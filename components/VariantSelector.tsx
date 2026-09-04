"use client";

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
  // Unique color options - only display if > 1 color
  const colorVariants = variants.filter(
    (v, idx, arr) =>
      v.colorName && arr.findIndex((o) => o.colorName === v.colorName) === idx,
  );

  // Extract dynamic attributes (Storage, RAM, etc.)
  const attributeKeys = Array.from(
    new Set(variants.flatMap((v) => Object.keys(v.attributes || {}))),
  );

  function selectColor(colorName: string) {
    const match =
      variants.find(
        (v) =>
          v.colorName === colorName &&
          JSON.stringify(v.attributes) ===
            JSON.stringify(selectedVariant.attributes),
      ) || variants.find((v) => v.colorName === colorName);

    if (match) onChange(match);
  }

  function selectAttribute(key: string, val: string) {
    const match =
      variants.find(
        (v) =>
          v.colorName === selectedVariant.colorName &&
          v.attributes?.[key] === val,
      ) || variants.find((v) => v.attributes?.[key] === val);

    if (match) onChange(match);
  }

  const hasMultipleColors = colorVariants.length > 1;

  return (
    <div className="space-y-2 pt-1">
      {/* Color Swatch Pills */}
      {hasMultipleColors && (
        <div>
          <span className="text-[11px] font-semibold text-[var(--text-muted)]">
            Color:{" "}
            <span className="text-[var(--text-primary)] font-medium">
              {selectedVariant.colorName}
            </span>
          </span>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            {colorVariants.map((v) => {
              const isSelected = selectedVariant.colorName === v.colorName;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => selectColor(v.colorName!)}
                  className={`flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-medium transition ${
                    isSelected
                      ? "border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)] font-semibold shadow-2xs"
                      : "border-[var(--border)] bg-white text-[var(--text-secondary)] hover:border-[var(--lavender)]"
                  }`}
                >
                  {v.colorHex && (
                    <span
                      className="h-2 w-2 rounded-full border border-black/10"
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

      {/* Spec/Storage Pills */}
      {attributeKeys.map((key) => {
        const uniqueValues = Array.from(
          new Set(variants.map((v) => v.attributes?.[key]).filter(Boolean)),
        );

        // Hide if only 1 option
        if (uniqueValues.length <= 1) return null;

        return (
          <div key={key}>
            <span className="text-[11px] font-semibold text-[var(--text-muted)]">
              {key}:{" "}
              <span className="text-[var(--text-primary)] font-medium">
                {selectedVariant.attributes?.[key]}
              </span>
            </span>
            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              {uniqueValues.map((val) => {
                const isSelected = selectedVariant.attributes?.[key] === val;
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => selectAttribute(key, val)}
                    className={`rounded-md border px-2 py-0.5 text-[11px] font-medium transition ${
                      isSelected
                        ? "border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)] font-semibold shadow-2xs"
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
  );
}
