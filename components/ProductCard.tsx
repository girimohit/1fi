import Link from "next/link";
import { ArrowRight, Tag } from "lucide-react";
import type { Product } from "@/types/product";
import { formatPrice, calculateEmi } from "@/lib/emi";

type ProductCardProps = {
    product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
    const variant =
        product.variants.find((item) => item.isDefault) ??
        product.variants[0];

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
            firstPlan.tenureMonths
        )
        : null;

    return (
        <Link
            href={`/products/${product.slug}`}
            className="group flex h-full flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-white transition hover:-translate-y-0.5 hover:border-[var(--lavender)] hover:shadow-md"
        >
            <div className="relative aspect-square overflow-hidden bg-[var(--gray)]">
                {product.badge && (
                    <span className="absolute left-3 top-3 z-10 rounded-md bg-[var(--primary)] px-2.5 py-1 text-xs font-semibold text-white">
                        {product.badge}
                    </span>
                )}

                <img
                    src={variant.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-contain p-5 transition duration-300 group-hover:scale-105"
                />
            </div>

            <div className="flex flex-1 flex-col p-4">
                <p className="text-xs font-medium text-[var(--text-muted)]">
                    {product.brand}
                </p>

                <h2 className="mt-1 line-clamp-2 min-h-[40px] text-sm font-semibold leading-5 text-[var(--text-primary)] sm:text-base">
                    {product.name}
                </h2>

                <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-lg font-bold text-[var(--text-primary)]">
                        ₹{formatPrice(variant.price)}
                    </span>

                    {variant.mrp > variant.price && (
                        <span className="text-xs text-[var(--text-muted)] line-through">
                            ₹{formatPrice(variant.mrp)}
                        </span>
                    )}

                    {discount > 0 && (
                        <span className="text-xs font-semibold text-green-600">
                            {discount}% off
                        </span>
                    )}
                </div>

                {monthlyEmi && firstPlan && (
                    <div className="mt-3 rounded-lg bg-[var(--primary-light)] px-3 py-2">
                        <p className="text-xs text-[var(--text-muted)]">
                            EMI from
                        </p>
                        <p className="text-sm font-semibold text-[var(--primary)]">
                            ₹{formatPrice(monthlyEmi)}/month
                            <span className="ml-1 text-xs font-normal">
                                × {firstPlan.tenureMonths}
                            </span>
                        </p>
                    </div>
                )}

                <div className="mt-auto flex items-center justify-between pt-4">
                    <span className="text-xs text-[var(--text-muted)]">
                        {variant.title}
                    </span>

                    <span className="flex items-center gap-1 text-xs font-semibold text-[var(--primary)]">
                        View
                        <ArrowRight
                            size={14}
                            className="transition-transform group-hover:translate-x-0.5"
                        />
                    </span>
                </div>
            </div>
        </Link>
    );
}