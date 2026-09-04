"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Star, Truck, ShieldCheck } from "lucide-react";
import { useParams } from "next/navigation";

import ProductGallery from "@/components/ProductGallery";
import VariantSelector from "@/components/VariantSelector";
import EmiTenureSelector from "@/components/EmiTenureSelector";
import ApplicationModal from "@/components/ApplicationModal";
import { getProduct } from "@/lib/api";
import { formatPrice } from "@/lib/emi";
import type { EmiPlan, Product, ProductVariant } from "@/types/product";

export default function ProductPage() {
    const params = useParams();
    const slug = params.slug as string;

    const [product, setProduct] = useState<Product | null>(null);
    const [selectedVariant, setSelectedVariant] =
        useState<ProductVariant | null>(null);
    const [selectedPlan, setSelectedPlan] = useState<EmiPlan | null>(null);
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
                    setProduct(null);
                    return;
                }

                setProduct(data);

                const defaultVariant =
                    data.variants.find((variant) => variant.isDefault) ??
                    data.variants[0] ??
                    null;

                setSelectedVariant(defaultVariant);
            } catch {
                setError("Unable to load this product.");
            } finally {
                setLoading(false);
            }
        }

        loadProduct();
    }, [slug]);

    useEffect(() => {
        setSelectedPlan(null);
    }, [selectedVariant?.id]);

    const discount = useMemo(() => {
        if (!selectedVariant || selectedVariant.mrp <= selectedVariant.price) {
            return 0;
        }

        return Math.round(
            ((selectedVariant.mrp - selectedVariant.price) /
                selectedVariant.mrp) *
            100
        );
    }, [selectedVariant]);

    if (loading) {
        return (
            <main className="min-h-screen bg-[var(--background)]">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <div className="h-5 w-32 animate-pulse rounded bg-[var(--gray)]" />

                    <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(380px,0.9fr)]">
                        <div className="aspect-square animate-pulse rounded-xl bg-[var(--gray)]" />

                        <div className="space-y-4">
                            <div className="h-5 w-20 animate-pulse rounded bg-[var(--gray)]" />
                            <div className="h-9 w-3/4 animate-pulse rounded bg-[var(--gray)]" />
                            <div className="h-8 w-40 animate-pulse rounded bg-[var(--gray)]" />
                            <div className="h-40 animate-pulse rounded-xl bg-[var(--gray)]" />
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4">
                <div className="text-center">
                    <p className="font-semibold">{error}</p>
                    <Link
                        href="/"
                        className="mt-3 inline-block text-sm font-semibold text-[var(--primary)]"
                    >
                        Back to products
                    </Link>
                </div>
            </main>
        );
    }

    if (!product || !selectedVariant) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4">
                <div className="text-center">
                    <p className="font-semibold">Product not found</p>
                    <Link
                        href="/"
                        className="mt-3 inline-block text-sm font-semibold text-[var(--primary)]"
                    >
                        Back to products
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[var(--background)]">
            <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
                <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--text-muted)] transition hover:text-[var(--primary)]"
                >
                    <ArrowLeft size={16} />
                    Back to products
                </Link>

                <div className="mt-5 grid gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(380px,0.9fr)] lg:gap-10">
                    <ProductGallery variant={selectedVariant} />

                    <div>
                        <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-medium text-[var(--primary)]">
                                {product.brand}
                            </p>

                            {product.badge && (
                                <span className="rounded-md bg-[var(--primary-light)] px-2.5 py-1 text-xs font-semibold text-[var(--primary)]">
                                    {product.badge}
                                </span>
                            )}
                        </div>

                        <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                            {product.name}
                        </h1>

                        <p className="mt-1 text-sm text-[var(--text-muted)]">
                            {selectedVariant.title}
                        </p>

                        <div className="mt-3 flex items-center gap-2">
                            <div className="flex items-center gap-1 rounded-md bg-green-600 px-2 py-1 text-xs font-semibold text-white">
                                4.2
                                <Star size={12} fill="currentColor" />
                            </div>

                            <span className="text-xs text-[var(--text-muted)]">
                                Product rating
                            </span>
                        </div>

                        <div className="mt-5 border-b border-[var(--border)] pb-5">
                            <div className="flex flex-wrap items-baseline gap-2">
                                <span className="text-2xl font-bold sm:text-3xl">
                                    ₹{formatPrice(selectedVariant.price)}
                                </span>

                                {selectedVariant.mrp > selectedVariant.price && (
                                    <>
                                        <span className="text-sm text-[var(--text-muted)] line-through">
                                            ₹{formatPrice(selectedVariant.mrp)}
                                        </span>

                                        <span className="text-sm font-semibold text-green-600">
                                            {discount}% off
                                        </span>
                                    </>
                                )}
                            </div>

                            <p className="mt-1 text-xs text-[var(--text-muted)]">
                                Inclusive of all applicable taxes
                            </p>

                            {selectedVariant.stockQuantity <= 5 &&
                                selectedVariant.stockQuantity > 0 && (
                                    <p className="mt-3 text-sm font-semibold text-orange-600">
                                        Only {selectedVariant.stockQuantity} left in stock
                                    </p>
                                )}

                            {selectedVariant.stockQuantity <= 0 && (
                                <p className="mt-3 text-sm font-semibold text-red-600">
                                    Currently out of stock
                                </p>
                            )}
                        </div>

                        <div className="py-5">
                            <VariantSelector
                                variants={product.variants}
                                selectedVariant={selectedVariant}
                                onChange={setSelectedVariant}
                            />
                        </div>

                        <EmiTenureSelector
                            key={selectedVariant.id}
                            plans={selectedVariant.emiPlans}
                            productPrice={selectedVariant.price}
                            onProceed={(plan) => {
                                setSelectedPlan(plan);
                                setShowApplication(true);
                            }}
                        />

                        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                            <div className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-white p-3">
                                <Truck
                                    size={17}
                                    className="shrink-0 text-[var(--primary)]"
                                />
                                <span className="text-xs font-medium">
                                    Fast delivery
                                </span>
                            </div>

                            <div className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-white p-3">
                                <ShieldCheck
                                    size={17}
                                    className="shrink-0 text-[var(--primary)]"
                                />
                                <span className="text-xs font-medium">
                                    Secure application
                                </span>
                            </div>

                            <div className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-white p-3">
                                <Star
                                    size={17}
                                    className="shrink-0 text-[var(--primary)]"
                                />
                                <span className="text-xs font-medium">
                                    Flexible EMI
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {product.description && (
                    <section className="mt-8 rounded-xl border border-[var(--border)] bg-white p-5 sm:p-6">
                        <h2 className="text-base font-semibold">
                            About this product
                        </h2>

                        <p className="mt-3 whitespace-pre-line text-sm leading-6 text-[var(--text-secondary)]">
                            {product.description}
                        </p>
                    </section>
                )}

                {product.specs &&
                    Object.keys(product.specs).length > 0 && (
                        <section className="mt-4 rounded-xl border border-[var(--border)] bg-white p-5 sm:p-6">
                            <h2 className="text-base font-semibold">
                                Specifications
                            </h2>

                            <div className="mt-4 divide-y divide-[var(--border)]">
                                {Object.entries(product.specs).map(
                                    ([key, value]) => (
                                        <div
                                            key={key}
                                            className="grid grid-cols-2 gap-4 py-3 text-sm"
                                        >
                                            <span className="text-[var(--text-muted)]">
                                                {key}
                                            </span>

                                            <span className="font-medium">
                                                {typeof value === "object"
                                                    ? JSON.stringify(value)
                                                    : String(value)}
                                            </span>
                                        </div>
                                    )
                                )}
                            </div>
                        </section>
                    )}
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