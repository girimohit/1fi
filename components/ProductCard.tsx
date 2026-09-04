import Link from "next/link";
import type { Product } from "@/types/product";

type ProductCardProps = {
    product: Product;
};

function formatPrice(price: number) {
    return new Intl.NumberFormat("en-IN").format(price);
}

export default function ProductCard({ product }: ProductCardProps) {
    const variant = product.variants?.[0];
    if (!variant) {
        return null;
    }
    const discount = Math.round(
        ((variant.mrp - variant.price) / variant.mrp) * 100
    );
    const firstEmi = variant.emiPlans?.[0];

    return (
        <Link
            href={`/products/${product.slug}`}
            className="group block overflow-hidden rounded-2xl border border-[var(--border)] bg-white transition hover:-translate-y-0.5 hover:shadow-md"
        >
            <div className="relative flex h-64 items-center justify-center bg-[#fafafa] p-6">
                {product.badge && (
                    <span className="absolute left-4 top-4 rounded-full bg-[var(--primary-light)] px-3 py-1 text-xs font-semibold text-[var(--primary)]">
                        {product.badge}
                    </span>
                )}

                <img
                    src={variant.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-contain transition duration-300 group-hover:scale-[1.03]"
                />
            </div>

            <div className="p-5">
                <p className="text-sm text-[var(--text-muted)]">{product.brand}</p>

                <h2 className="mt-1 line-clamp-2 text-base font-semibold text-[var(--text-primary)]">
                    {product.name}
                </h2>

                <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-lg font-bold">
                        ₹{formatPrice(variant.price)}
                    </span>

                    <span className="text-sm text-[var(--text-muted)] line-through">
                        ₹{formatPrice(variant.mrp)}
                    </span>

                    <span className="text-xs font-medium text-green-600">
                        {discount}% off
                    </span>
                </div>

                {firstEmi && (
                    <p className="mt-3 text-sm text-[var(--text-secondary)]">
                        EMI from{" "}
                        <span className="font-semibold text-[var(--text-primary)]">
                            ₹
                            {formatPrice(
                                Math.round(variant.price / firstEmi.tenureMonths)
                            )}
                            /mo
                        </span>
                    </p>
                )}
            </div>
        </Link>
    );
}