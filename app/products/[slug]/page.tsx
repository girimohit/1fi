"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ChevronRight,
  RotateCcw,
  Award,
  Truck,
  CheckCircle2,
} from "lucide-react";

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
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null,
  );
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
      ((selectedVariant.mrp - selectedVariant.price) / selectedVariant.mrp) *
        100,
    );
  }, [selectedVariant]);

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="h-4 w-32 animate-pulse rounded bg-[var(--gray)]" />

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="aspect-square animate-pulse rounded-xl bg-[var(--gray)]" />

            <div className="space-y-4">
              <div className="h-6 w-3/4 animate-pulse rounded bg-[var(--gray)]" />
              <div className="h-5 w-1/3 animate-pulse rounded bg-[var(--gray)]" />
              <div className="h-9 w-40 animate-pulse rounded bg-[var(--gray)]" />
              <div className="h-48 animate-pulse rounded-xl bg-[var(--gray)]" />
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
            className="mt-5 inline-flex items-center rounded-lg bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white"
          >
            Back to Shop
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-white pb-10">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-5 flex min-w-0 items-center gap-1 text-xs text-[var(--text-muted)]">
          <Link href="/" className="shrink-0 hover:text-[var(--primary)]">
            Store
          </Link>

          <ChevronRight size={12} className="shrink-0" />

          <Link
            href="/"
            className="max-w-[100px] truncate hover:text-[var(--primary)] sm:max-w-none"
          >
            {product.category?.name || "Products"}
          </Link>

          <ChevronRight size={12} className="shrink-0" />

          <span className="min-w-0 truncate font-semibold text-[var(--text-primary)]">
            {product.name}
          </span>
        </nav>

        {/* Main Product */}
        <div className="grid min-w-0 gap-6 lg:grid-cols-2 lg:gap-10">
          {/* Gallery */}
          <div className="min-w-0 space-y-4 lg:sticky lg:top-6 lg:self-start">
            <ProductGallery variant={selectedVariant} />

            <div className="min-w-0">
              <VariantSelector
                variants={product.variants}
                selectedVariant={selectedVariant}
                onChange={setSelectedVariant}
              />
            </div>
          </div>

          {/* Product Information */}
          <div className="min-w-0 space-y-5">
            {/* Title */}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[var(--primary-light)] px-2.5 py-1 text-xs font-semibold text-[var(--primary)]">
                  {product.brand}
                </span>

                {selectedVariant.stockQuantity > 0 && (
                  <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                    <CheckCircle2 size={13} />
                    In Stock
                  </span>
                )}
              </div>

              <h1 className="mt-2 break-words text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl">
                {product.name}
              </h1>

              <p className="mt-1 break-words text-sm text-[var(--text-secondary)]">
                {selectedVariant.colorName &&
                  `Color: ${selectedVariant.colorName}`}

                {selectedVariant.colorName &&
                  selectedVariant.attributes?.Storage &&
                  " • "}

                {selectedVariant.attributes?.Storage &&
                  `Storage: ${selectedVariant.attributes.Storage}`}
              </p>
            </div>

            {/* Price */}
            <div className="min-w-0 px-0 sm:px-1">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="text-2xl font-extrabold text-[var(--text-primary)] sm:text-4xl">
                  ₹{formatPrice(selectedVariant.price)}
                </span>

                {selectedVariant.mrp > selectedVariant.price && (
                  <>
                    <span className="text-sm text-[var(--text-muted)] line-through sm:text-base">
                      ₹{formatPrice(selectedVariant.mrp)}
                    </span>

                    <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">
                      Save {discount}%
                    </span>
                  </>
                )}
              </div>

              <p className="mt-1 text-[11px] leading-4 text-[var(--text-muted)]">
                Inclusive of all taxes
              </p>
            </div>

            {/* EMI */}
            <div className="min-w-0">
              <EmiTenureSelector
                key={selectedVariant.id}
                plans={selectedVariant.emiPlans}
                productPrice={selectedVariant.price}
                onProceed={(plan) => {
                  setSelectedPlan(plan);
                  setShowApplication(true);
                }}
              />
            </div>

            {/* Trust */}
            <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-3">
              <div className="flex min-w-0 items-center gap-2.5 rounded-xl border border-[var(--border)] bg-white p-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--primary-light)] text-[var(--primary)]">
                  <Truck size={16} />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-xs font-bold leading-tight">
                    Express Delivery
                  </p>

                  <p className="text-[11px] text-[var(--text-muted)]">
                    In 3-5 days
                  </p>
                </div>
              </div>

              <div className="flex min-w-0 items-center gap-2.5 rounded-xl border border-[var(--border)] bg-white p-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--primary-light)] text-[var(--primary)]">
                  <RotateCcw size={16} />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-xs font-bold leading-tight">
                    Easy Replacement
                  </p>

                  <p className="text-[11px] text-[var(--text-muted)]">
                    7-Day policy
                  </p>
                </div>
              </div>

              <div className="flex min-w-0 items-center gap-2.5 rounded-xl border border-[var(--border)] bg-white p-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--primary-light)] text-[var(--primary)]">
                  <Award size={16} />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-xs font-bold leading-tight">
                    Brand Warranty
                  </p>

                  <p className="text-[11px] text-[var(--text-muted)]">
                    1 Year Official
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div className="min-w-0 border-t border-[var(--border)] pt-5">
                <h3 className="text-sm font-bold text-[var(--text-primary)]">
                  Product Overview
                </h3>

                <p className="mt-2 break-words text-xs leading-5 text-[var(--text-secondary)] sm:text-sm sm:leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Specifications */}
            {product.specs && Object.keys(product.specs).length > 0 && (
              <div className="min-w-0 border-t border-[var(--border)] pt-5">
                <h3 className="text-sm font-bold text-[var(--text-primary)]">
                  Technical Specifications
                </h3>

                <div className="mt-3 min-w-0 overflow-hidden rounded-xl border border-[var(--border)] bg-gray-50/30">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div
                      key={key}
                      className="grid min-w-0 grid-cols-2 gap-3 border-b border-[var(--border)] px-3 py-2.5 text-xs last:border-b-0 sm:px-4 sm:text-sm"
                    >
                      <span className="min-w-0 break-words font-medium capitalize text-[var(--text-muted)]">
                        {key}
                      </span>

                      <span className="min-w-0 break-words font-semibold text-[var(--text-primary)]">
                        {typeof value === "object"
                          ? JSON.stringify(value)
                          : String(value)}
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
