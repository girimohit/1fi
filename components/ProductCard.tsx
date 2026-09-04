import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { Product } from "@/types/product";
import { calculateEmi, formatPrice } from "@/lib/emi";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const variant =
    product.variants.find((item) => item.isDefault) ?? product.variants[0];

  if (!variant) return null;

  const discount =
    variant.mrp > variant.price
      ? Math.round(((variant.mrp - variant.price) / variant.mrp) * 100)
      : 0;

  const firstPlan = variant.emiPlans?.[0];

  const monthlyEmi = firstPlan
    ? calculateEmi(
        variant.price,
        Number(firstPlan.interestRate),
        firstPlan.tenureMonths,
      )
    : null;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="
        group flex overflow-hidden rounded-xl border
        border-[var(--border)] bg-white
        transition
        hover:border-[var(--lavender)]
        hover:shadow-md

        sm:h-full sm:flex-col
      "
    >
      {/* Image */}
      <div
        className="
          relative h-32 w-32 shrink-0
          overflow-hidden bg-[var(--gray)]

          sm:h-auto sm:w-auto sm:aspect-square
        "
      >
        {/* {product.badge && (
                    <span className="absolute left-2 top-2 z-10 rounded-md bg-[var(--primary)] px-2 py-1 text-[10px] font-semibold text-white sm:left-3 sm:top-3 sm:text-xs">
                        {product.badge}
                    </span>
                )} */}

        <img
          src={variant.imageUrl}
          alt={product.name}
          className="
            h-full w-full object-contain p-3
            transition duration-300
            group-hover:scale-105

            sm:p-5
          "
        />
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col p-3 sm:p-4">
        <p className="text-[10px] font-medium uppercase tracking-wide text-[var(--text-muted)] sm:text-xs">
          {product.brand}
        </p>

        <h2 className="mt-1 line-clamp-2 text-sm font-semibold leading-5 text-[var(--text-primary)] sm:min-h-[40px] sm:text-base">
          {product.name}
        </h2>

        {/* Price */}
        <div className="mt-2 flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5 sm:mt-3 sm:gap-2">
          <span className="text-base font-bold text-[var(--text-primary)] sm:text-lg">
            ₹{formatPrice(variant.price)}
          </span>

          {variant.mrp > variant.price && (
            <span className="text-[10px] text-[var(--text-muted)] line-through sm:text-xs">
              ₹{formatPrice(variant.mrp)}
            </span>
          )}

          {discount > 0 && (
            <span className="text-[10px] font-semibold text-green-600 sm:text-xs">
              {discount}% off
            </span>
          )}
        </div>

        {/* EMI */}
        {monthlyEmi && firstPlan && (
          <div className="mt-2.5 rounded-lg bg-[var(--primary-light)] px-2.5 py-2 sm:mt-3 sm:px-3 sm:py-2">
            <p className="text-[10px] text-[var(--text-muted)] sm:text-xs">
              EMI from
            </p>

            <p className="text-xs font-semibold text-[var(--primary)] sm:text-sm">
              ₹{formatPrice(monthlyEmi)}
              <span className="font-normal">/month</span>
            </p>
          </div>
        )}

        {/* Bottom */}
        <div className="mt-auto flex items-center justify-between gap-2 pt-2.5 sm:pt-4">
          <span className="truncate text-[10px] text-[var(--text-muted)] sm:text-xs">
            {variant.title}
          </span>

          <span className="flex shrink-0 items-center gap-1 text-[10px] font-semibold text-[var(--primary)] sm:text-xs">
            View
            <ArrowRight
              size={13}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}
