"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
    ChevronRight,
    RotateCcw,
    Award,
    Truck,
    ShieldCheck,
    CheckCircle2,
} from "lucide-react";
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
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
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
            ((selectedVariant.mrp - selectedVariant.price) / selectedVariant.mrp) * 100
        );
    }, [selectedVariant]);

    if (loading) {
        return (
            <main className="min-h-screen bg-white">
                <div className="w-full max-w-[1500px] mx-auto px-4 py-8 sm:px-8 lg:px-12">
                    <div className="h-4 w-48 animate-pulse rounded-md bg-[var(--gray)]" />
                    <div className="mt-6 grid gap-10 lg:grid-cols-2">
                        <div className="h-[420px] animate-pulse rounded-2xl bg-[var(--gray)]" />
                        <div className="space-y-4">
                            <div className="h-8 w-3/4 animate-pulse rounded-md bg-[var(--gray)]" />
                            <div className="h-5 w-1/3 animate-pulse rounded-md bg-[var(--gray)]" />
                            <div className="h-10 w-40 animate-pulse rounded-md bg-[var(--gray)]" />
                            <div className="h-60 animate-pulse rounded-2xl bg-[var(--gray)]" />
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    if (error || !product || !selectedVariant) {
        return (
            <main className="flex min-h-[70vh] flex-col items-center justify-center bg-white px-4">
                <div className="text-center">
                    <h1 className="text-xl font-bold text-[var(--text-primary)]">
                        {error || "Product not found"}
                    </h1>
                    <p className="mt-1 text-sm text-[var(--text-muted)]">
                        The requested product is currently unavailable.
                    </p>
                    <Link
                        href="/"
                        className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:opacity-90"
                    >
                        Back to Shop
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-white pb-20">
            <div className="w-full max-w-[1450px] mx-auto px-4  py-5 sm:px-8 lg:px-12">
                {/* Modern Breadcrumb */}
                    <nav className="mb-6 pt-6 flex flex-wrap items-center gap-1.5 text-xs text-[var(--text-muted)]">
                    <Link href="/" className="transition hover:text-[var(--primary)]">Store</Link>
                    <ChevronRight size={12} className="text-gray-400" />
                    <Link href="/" className="transition hover:text-[var(--primary)]">
                        {product.category?.name || "Products"}
                    </Link>
                    <ChevronRight size={12} className="text-gray-400" />
                    <span className="font-semibold text-[var(--text-primary)] truncate max-w-[240px] sm:max-w-md">
                        {product.name}
                    </span>
                </nav>

                {/* 2-Column Responsive Layout */}
                <div className="grid gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-20">
                    {/* LEFT COLUMN: Gallery & Variant Selector */}
                    <div className="lg:sticky lg:top-6 lg:self-start space-y-4">
                        <ProductGallery variant={selectedVariant} />

                        <VariantSelector
                            variants={product.variants}
                            selectedVariant={selectedVariant}
                            onChange={setSelectedVariant}
                        />
                    </div>

                    {/* RIGHT COLUMN: Info, Price, EMI Plans, Trust, Specs */}
                    <div className="space-y-6">
                        {/* Title & Brand */}
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="rounded-full bg-[var(--primary-light)] px-2.5 py-0.5 text-xs font-semibold text-[var(--primary)]">
                                    {product.brand}
                                </span>
                                {selectedVariant.stockQuantity > 0 && (
                                    <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                                        <CheckCircle2 size={13} /> In Stock
                                    </span>
                                )}
                            </div>

                            <h1 className="mt-2 text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl lg:text-3.5xl">
                                {product.name}
                            </h1>

                            <p className="mt-1 text-sm text-[var(--text-secondary)]">
                                {selectedVariant.colorName && `Color: ${selectedVariant.colorName}`}
                                {selectedVariant.colorName && selectedVariant.attributes?.Storage && " • "}
                                {selectedVariant.attributes?.Storage && `Storage: ${selectedVariant.attributes.Storage}`}
                            </p>
                        </div>

                        {/* Price Display */}
                        {/* <div className="rounded-2xl border border-[var(--border)] bg-gray-50/40 p-4"> */}
                        <div className="p-4">
                            <div className="flex items-baseline gap-3">
                                <span className="text-3xl font-extrabold text-[var(--text-primary)] sm:text-4xl">
                                    ₹{formatPrice(selectedVariant.price)}
                                </span>

                                {selectedVariant.mrp > selectedVariant.price && (
                                    <>
                                        <span className="text-base text-[var(--text-muted)] line-through">
                                            ₹{formatPrice(selectedVariant.mrp)}
                                        </span>
                                        <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">
                                            Save {discount}%
                                        </span>
                                    </>
                                )}
                            </div>
                            <p className="mt-1 text-[11px] text-[var(--text-muted)]">
                                Inclusive of all taxes • Free shipping across India
                            </p>
                        </div>

                        {/* EMI Tenure Card Component */}
                        <EmiTenureSelector
                            key={selectedVariant.id}
                            plans={selectedVariant.emiPlans}
                            productPrice={selectedVariant.price}
                            onProceed={(plan) => {
                                setSelectedPlan(plan);
                                setShowApplication(true);
                            }}
                        />

                        {/* Trust & Delivery Highlights */}
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                            <div className="flex items-center gap-2.5 rounded-xl border border-[var(--border)] bg-white p-3">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--primary-light)] text-[var(--primary)]">
                                    <Truck size={16} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-[var(--text-primary)] leading-tight">Express Delivery</p>
                                    <p className="text-[11px] text-[var(--text-muted)]">In 3-5 days</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2.5 rounded-xl border border-[var(--border)] bg-white p-3">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--primary-light)] text-[var(--primary)]">
                                    <RotateCcw size={16} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-[var(--text-primary)] leading-tight">Easy Replacement</p>
                                    <p className="text-[11px] text-[var(--text-muted)]">7-Day policy</p>
                                </div>
                            </div>

                            <div className="col-span-2 sm:col-span-1 flex items-center gap-2.5 rounded-xl border border-[var(--border)] bg-white p-3">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--primary-light)] text-[var(--primary)]">
                                    <Award size={16} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-[var(--text-primary)] leading-tight">Brand Warranty</p>
                                    <p className="text-[11px] text-[var(--text-muted)]">1 Year Official</p>
                                </div>
                            </div>
                        </div>

                        {/* Product Overview */}
                        {product.description && (
                            <div className="space-y-2 border-t border-[var(--border)] pt-5">
                                <h3 className="text-sm font-bold text-[var(--text-primary)]">
                                    Product Overview
                                </h3>
                                <p className="text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
                                    {product.description}
                                </p>
                            </div>
                        )}

                        {/* Specifications */}
                        {product.specs && Object.keys(product.specs).length > 0 && (
                            <div className="space-y-3 border-t border-[var(--border)] pt-5">
                                <h3 className="text-sm font-bold text-[var(--text-primary)]">
                                    Technical Specifications
                                </h3>
                                <div className="rounded-xl border border-[var(--border)] bg-gray-50/30 overflow-hidden divide-y divide-[var(--border)]">
                                    {Object.entries(product.specs).map(([key, value]) => (
                                        <div key={key} className="grid grid-cols-2 gap-4 px-4 py-2.5 text-xs sm:text-sm">
                                            <span className="text-[var(--text-muted)] capitalize font-medium">{key}</span>
                                            <span className="font-semibold text-[var(--text-primary)]">
                                                {typeof value === "object" ? JSON.stringify(value) : String(value)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Application Modal */}
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