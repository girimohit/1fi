"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    Star,
    Truck,
    ShieldCheck,
    Search,
    ChevronRight,
    Flame,
    RotateCcw,
    Award,
    Sparkles,
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
            <main className="min-h-screen bg-[var(--background)]">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <div className="h-6 w-36 animate-pulse rounded-lg bg-[var(--gray)]" />
                    <div className="mt-6 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
                        <div className="aspect-square animate-pulse rounded-2xl bg-[var(--gray)]" />
                        <div className="space-y-4">
                            <div className="h-5 w-24 animate-pulse rounded bg-[var(--gray)]" />
                            <div className="h-9 w-3/4 animate-pulse rounded bg-[var(--gray)]" />
                            <div className="h-8 w-44 animate-pulse rounded bg-[var(--gray)]" />
                            <div className="h-52 animate-pulse rounded-2xl bg-[var(--gray)]" />
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    if (error || !product || !selectedVariant) {
        return (
            <main className="flex min-h-[70vh] flex-col items-center justify-center bg-[var(--background)] px-4">
                <div className="rounded-2xl border border-[var(--border)] bg-white p-8 text-center shadow-xs">
                    <h1 className="text-lg font-bold text-[var(--text-primary)]">
                        {error || "Product not found"}
                    </h1>
                    <p className="mt-2 text-xs text-[var(--text-muted)]">
                        The product you are looking for is currently unavailable.
                    </p>
                    <Link
                        href="/"
                        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-2.5 text-xs font-semibold text-white shadow-xs"
                    >
                        <ArrowLeft size={16} />
                        Return to Store
                    </Link>
                </div>
            </main>
        );
    }

    // Build subtitle from specs variant
    const specsSummary = [
        selectedVariant.attributes?.Storage && `Storage: ${selectedVariant.attributes.Storage}`,
        selectedVariant.colorName && `Color: ${selectedVariant.colorName}`,
    ]
        .filter(Boolean)
        .join(", ");

    return (
        <main className="min-h-screen bg-[#FDFDFD] pb-16">
            {/* Top Navigation Bar with Brand Header matching Screenshot 1 */}
            <div className="sticky top-0 z-20 border-b border-[var(--border)] bg-white/95 backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-sm font-bold text-[var(--text-primary)] hover:text-[var(--primary)]"
                    >
                        <ArrowLeft size={18} />
                        <span>{product.brand}</span>
                    </Link>

                    <Link
                        href="/"
                        className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--text-secondary)] hover:bg-[var(--gray)]"
                        title="Search Products"
                    >
                        <Search size={18} />
                    </Link>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
                {/* Product Title & Demand Badge (Top on mobile & desktop) */}
                <div className="mb-5">
                    {/* <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
                            {product.brand}
                        </span>
                        {product.badge && (
                            <span className="rounded-md bg-[var(--primary-light)] px-2 py-0.5 text-[10px] font-bold text-[var(--primary)]">
                                {product.badge}
                            </span>
                        )}
                    </div> */}

                    <h1 className="mt-1 text-xl font-extrabold tracking-tight text-[var(--text-primary)] sm:text-2xl md:text-3xl">
                        {product.name} ({selectedVariant.colorName || "Standard"}, {selectedVariant.attributes?.Storage || selectedVariant.title})
                    </h1>

                    <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs">
                        {specsSummary && (
                            <span className="text-[var(--text-muted)]">
                                ({specsSummary})
                            </span>
                        )}
                        <span className="flex items-center gap-1 font-semibold text-[var(--primary)]">
                            <Flame size={14} className="fill-[var(--primary)] text-[var(--primary)]" />
                            70+ sold this week
                        </span>
                    </div>
                </div>

                {/* 2-Column Responsive Layout matching reference images */}
                <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
                    {/* LEFT COLUMN: Gallery & Variant Dropdowns */}
                    <div className="space-y-6">
                        <ProductGallery variant={selectedVariant} />

                        {/* Variant Selectors directly underneath the image */}
                        <div className="rounded-2xl border border-[var(--border)] bg-white p-4 shadow-xs">
                            <h3 className="mb-3 text-xs font-bold text-[var(--text-primary)]">
                                Select Options & Finishes
                            </h3>
                            <VariantSelector
                                variants={product.variants}
                                selectedVariant={selectedVariant}
                                onChange={setSelectedVariant}
                            />
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Pricing, EMI Plans, Seller & Trust */}
                    <div className="space-y-6">
                        {/* Dynamic Price Header */}
                        <div className="rounded-2xl border border-[var(--border)] bg-white p-5 shadow-xs">
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
                                            Save ₹{formatPrice(selectedVariant.mrp - selectedVariant.price)} ({discount}% OFF)
                                        </span>
                                    </>
                                )}
                            </div>

                            <p className="mt-1 text-xs text-[var(--text-muted)]">
                                Inclusive of all taxes • Free express shipping
                            </p>

                            {/* Inventory Alert */}
                            {selectedVariant.stockQuantity <= 5 && selectedVariant.stockQuantity > 0 && (
                                <p className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-[var(--primary-light)] px-2.5 py-1 text-xs font-semibold text-[var(--primary)]">
                                    <Sparkles size={13} />
                                    Only {selectedVariant.stockQuantity} units left in stock
                                </p>
                            )}
                        </div>

                        {/* EMI Tenure Selector Component (Snapmint layout) */}
                        <EmiTenureSelector
                            key={selectedVariant.id}
                            plans={selectedVariant.emiPlans}
                            productPrice={selectedVariant.price}
                            onProceed={(plan) => {
                                setSelectedPlan(plan);
                                setShowApplication(true);
                            }}
                        />

                        {/* Sold By & Shipping Details matching Reference Screenshot */}
                        <div className="space-y-3 rounded-2xl border border-[var(--border)] bg-white p-5 text-xs shadow-xs">
                            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                                <div>
                                    <span className="text-[var(--text-muted)]">Sold By: </span>
                                    <span className="font-bold text-[var(--text-primary)]">Balaji Infocom / Official Partner</span>
                                </div>
                                <ChevronRight size={15} className="text-[var(--text-muted)]" />
                            </div>

                            <div className="border-b border-[var(--border)] pb-3">
                                <p className="font-bold text-[var(--text-primary)]">Shipping Details:</p>
                                <p className="mt-1 text-[var(--text-secondary)] leading-relaxed">
                                    Dispatch in less than <span className="font-semibold text-[var(--text-primary)]">48 hours</span> and delivery in <span className="font-semibold text-[var(--text-primary)]">3-7 working days</span> after dispatch.
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 font-bold text-[var(--text-primary)]">Shop with Confidence:</p>
                                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 text-[var(--text-secondary)]">
                                    <div className="flex items-center gap-2">
                                        <RotateCcw size={14} className="text-[var(--primary)]" />
                                        <span>2 Days Service Centre Replacement</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Award size={14} className="text-[var(--primary)]" />
                                        <span>100% Top Brand Genuine</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck size={14} className="text-[var(--primary)]" />
                                        <span>Mutual Fund Backed Security</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Truck size={14} className="text-[var(--primary)]" />
                                        <span>Insured Transit Protection</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Description & Tech Specs Section */}
                {product.description && (
                    <section className="mt-10 rounded-2xl border border-[var(--border)] bg-white p-6 shadow-xs">
                        <h2 className="text-base font-bold text-[var(--text-primary)] sm:text-lg">
                            About {product.name}
                        </h2>
                        <p className="mt-3 whitespace-pre-line text-xs sm:text-sm leading-6 text-[var(--text-secondary)]">
                            {product.description}
                        </p>
                    </section>
                )}

                {product.specs && Object.keys(product.specs).length > 0 && (
                    <section className="mt-6 rounded-2xl border border-[var(--border)] bg-white p-6 shadow-xs">
                        <h2 className="text-base font-bold text-[var(--text-primary)] sm:text-lg">
                            Technical Specifications
                        </h2>

                        <div className="mt-4 divide-y divide-[var(--border)]">
                            {Object.entries(product.specs).map(([key, value]) => (
                                <div key={key} className="grid grid-cols-2 gap-4 py-3 text-xs sm:text-sm">
                                    <span className="font-medium text-[var(--text-muted)] capitalize">
                                        {key}
                                    </span>
                                    <span className="font-semibold text-[var(--text-primary)]">
                                        {typeof value === "object" ? JSON.stringify(value) : String(value)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
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