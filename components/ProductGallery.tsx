"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import type { ProductVariant } from "@/types/product";

type ProductGalleryProps = {
    variant: ProductVariant;
};

export default function ProductGallery({ variant }: ProductGalleryProps) {
    const images = [
        variant.imageUrl,
        ...(variant.images ?? []),
    ].filter(
        (image, index, array) => image && array.indexOf(image) === index
    );

    const [activeImage, setActiveImage] = useState(images[0]);

    useEffect(() => {
        setActiveImage(images[0]);
    }, [variant.id, images]);

    if (!images.length) {
        return (
            <div className="flex aspect-square items-center justify-center rounded-2xl border border-[var(--border)] bg-white text-sm text-[var(--text-muted)]">
                No image available
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 lg:flex-row">
            {/* Desktop Left Vertical Thumbnail Strip */}
            {images.length > 1 && (
                <div className="order-2 flex gap-2.5 overflow-x-auto pb-1 lg:order-1 lg:w-20 lg:flex-col lg:overflow-visible lg:pb-0">
                    {images.map((image, index) => {
                        const isSelected = activeImage === image;

                        return (
                            <button
                                key={`${image}-${index}`}
                                type="button"
                                onClick={() => setActiveImage(image)}
                                className={`group relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border bg-white p-1.5 transition sm:h-20 sm:w-20 ${
                                    isSelected
                                        ? "border-[var(--primary)] ring-2 ring-[var(--primary)]/20"
                                        : "border-[var(--border)] hover:border-[var(--lavender)]"
                                }`}
                            >
                                <img
                                    src={image}
                                    alt={`${variant.title} thumbnail ${index + 1}`}
                                    className="h-full w-full object-contain transition duration-200 group-hover:scale-105"
                                />
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Main Product Image Card */}
            <div className="order-1 relative flex aspect-square flex-1 items-center justify-center overflow-hidden rounded-2xl border border-[var(--border)] bg-white p-8 sm:p-12">
                {/* 1% Cashback Badge */}
                <div className="absolute bottom-4 left-4 z-10 rounded-md bg-[var(--primary)] px-2.5 py-1 text-xs font-bold text-white shadow-2xs">
                    1% Cashback
                </div>

                {/* Rating Badge */}
                <div className="absolute right-4 top-4 z-10 flex items-center gap-1 rounded-md border border-[var(--border)] bg-white/95 px-2.5 py-1 text-xs font-semibold shadow-2xs">
                    <span>4.2</span>
                    <Star size={13} className="fill-amber-400 text-amber-400" />
                </div>

                {/* Main Image */}
                <img
                    src={activeImage}
                    alt={variant.title}
                    className="max-h-[420px] w-full object-contain transition duration-300 hover:scale-105"
                />

                {/* Mobile pagination dots */}
                {images.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 lg:hidden">
                        {images.map((image, idx) => (
                            <span
                                key={idx}
                                className={`h-1.5 rounded-full transition-all ${
                                    activeImage === image
                                        ? "w-5 bg-[var(--primary)]"
                                        : "w-1.5 bg-gray-300"
                                }`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}