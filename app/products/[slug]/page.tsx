"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ChevronRight, Star } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { getProduct } from "@/lib/api";

import ProductGallery from "@/components/ProductGallery";
import VariantSelector from "@/components/VariantSelector";
import EmiTenureSelector from "@/components/EmiTenureSelector";
import ApplicationModal from "@/components/ApplicationModal";

import type {
    EmiPlan,
    Product,
    ProductVariant,
} from "@/types/product";

function formatPrice(price: number) {
    return new Intl.NumberFormat("en-IN").format(price);
}

export default function ProductPage() {
    const params = useParams();
    const slug = params.slug as string;

    const [product, setProduct] = useState<Product | null>(null);
    const [selectedVariant, setSelectedVariant] =
        useState<ProductVariant | null>(null);

    const [selectedPlan, setSelectedPlan] =
        useState<EmiPlan | null>(null);

    const [showApplication, setShowApplication] = useState(false);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadProduct() {
            try {
                setLoading(true);
                setError("");

                const data = await getProduct(slug);

                if (!data) {
                    setError("Product not found");
                    return;
                }

                setProduct(data);

                const defaultVariant =
                    data.variants.find((variant) => variant.isDefault) ??
                    data.variants[0];

                setSelectedVariant(defaultVariant ?? null);
            } catch {
                setError("Unable to load product");
            } finally {
                setLoading(false);
            }
        }

        loadProduct();
    }, [slug]);

    function handleVariantChange(variant: ProductVariant) {
        setSelectedVariant(variant);
        setSelectedPlan(null);
    }

    function handleProceed(plan: EmiPlan) {
        setSelectedPlan(plan);
        setShowApplication(true);
    }

    if (loading) {
        return (
            <main className="mx-auto max-w-7xl px-5 py-10">
                <div className="grid gap-8 lg:grid-cols-2">
                    <div className="h-[550px] animate-pulse rounded-2xl bg-[var(--surface-muted)]" />

                    <div className="space-y-4">
                        <div className="h-8 w-3/4 animate-pulse rounded bg-[var(--surface-muted)]" />
                        <div className="h-5 w-1/2 animate-pulse rounded bg-[var(--surface-muted)]" />
                        <div className="h-10 w-1/3 animate-pulse rounded bg-[var(--surface-muted)]" />
                        <div className="h-48 animate-pulse rounded-xl bg-[var(--surface-muted)]" />
                    </div>
                </div>
            </main>
        );
    }

    if (error || !product || !selectedVariant) {
        return (
            <main className="flex min-h-[70vh] items-center justify-center px-5">
                <div className="text-center">
                    <h1 className="text-xl font-semibold">
                        {error || "Product unavailable"}
                    </h1>

                    <Link
                        href="/"
                        className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--primary)]"
                    >
                        <ArrowLeft size={16} />
                        Back to shop
                    </Link>
                </div>
            </main>
        );
    }

    const discount = Math.round(
        ((selectedVariant.mrp - selectedVariant.price) /
            selectedVariant.mrp) *
        100
    );

    return (
        <main className="min-h-screen bg-white">
            <div className="mx-auto max-w-7xl px-5 py-6 md:px-8 md:py-10">
                <Link
                    href="/"
                    className="mb-6 inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--primary)]"
                >
                    <ArrowLeft size={16} />
                    Back to shop
                </Link>

                <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
                    {/* Product image */}

                    <div>
                        <ProductGallery variant={selectedVariant} />
                    </div>

                    {/* Product information */}

                    <div>
                        <p className="text-sm font-medium text-[var(--text-secondary)]">
                            {product.brand}
                        </p>

                        <div className="mt-1 flex items-start justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                                    {product.name}
                                </h1>

                                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                                    {selectedVariant.title}
                                </p>
                            </div>

                            {product.badge && (
                                <span className="shrink-0 rounded-full bg-[var(--primary-light)] px-3 py-1 text-xs font-semibold text-[var(--primary)]">
                                    {product.badge}
                                </span>
                            )}
                        </div>

                        <div className="mt-3 inline-flex items-center gap-1 rounded-md bg-[var(--surface-muted)] px-2 py-1 text-xs">
                            4.2
                            <Star
                                size={12}
                                className="fill-yellow-400 text-yellow-400"
                            />
                        </div>

                        <div className="mt-6 flex items-baseline gap-3">
                            <span className="text-3xl font-bold">
                                ₹{formatPrice(selectedVariant.price)}
                            </span>

                            <span className="text-base text-[var(--text-muted)] line-through">
                                ₹{formatPrice(selectedVariant.mrp)}
                            </span>

                            <span className="text-sm font-semibold text-green-600">
                                {discount}% off
                            </span>
                        </div>

                        {selectedVariant.stockQuantity <= 5 && (
                            <p className="mt-2 text-sm font-medium text-orange-600">
                                Only {selectedVariant.stockQuantity} left
                            </p>
                        )}

                        <div className="my-7 h-px bg-[var(--border)]" />

                        <VariantSelector
                            variants={product.variants}
                            selectedVariant={selectedVariant}
                            onChange={handleVariantChange}
                        />

                        <div className="mt-8">
                            <EmiTenureSelector
                                plans={selectedVariant.emiPlans}
                                productPrice={selectedVariant.price}
                                onProceed={handleProceed}
                            />
                        </div>

                        <div className="mt-6 space-y-4 text-sm">
                            <div>
                                <p className="font-semibold">Shipping Details</p>

                                <p className="mt-1 text-[var(--text-secondary)]">
                                    Dispatch in less than 48 hours and delivery
                                    in 3–7 working days after dispatch.
                                </p>
                            </div>

                            <div>
                                <p className="font-semibold">Shop with confidence</p>

                                <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-[var(--text-secondary)]">
                                    <span>Easy replacement</span>
                                    <span>Trusted brand</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showApplication && selectedPlan && (
                <ApplicationModal
                    variant={selectedVariant}
                    plan={selectedPlan}
                    productName={product.name}
                    onClose={() => setShowApplication(false)}
                />
            )}
        </main>
    );
}