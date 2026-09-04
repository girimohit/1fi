"use client";

import { useEffect, useMemo, useState } from "react";
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

    // Random rating between 3.5 and 4.9 (deterministic per variant id to prevent jitter)
    const rating = useMemo(() => {
        let hash = 0;
        for (let i = 0; i < variant.id.length; i++) {
            hash = (hash << 5) - hash + variant.id.charCodeAt(i);
            hash |= 0;
        }
        const normalized = Math.abs(hash % 15) / 10; // 0.0 to 1.4
        return (3.5 + normalized).toFixed(1);
    }, [variant.id]);

    const ratingCount = useMemo(() => {
        let hash = 0;
        for (let i = 0; i < variant.id.length; i++) {
            hash = (hash << 3) + variant.id.charCodeAt(i);
        }
        return 40 + Math.abs(hash % 260);
    }, [variant.id]);

    if (!images.length) {
        return (
            <div className="flex aspect-square min-h-[460px] items-center justify-center rounded-2xl border border-[var(--border)] bg-white text-sm text-[var(--text-muted)]">
                No image available
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3 sm:flex-row">
            {/* Desktop Left Vertical Thumbnail Strip */}
            {images.length > 1 && (
                <div className="order-2 flex gap-2.5 overflow-x-auto pb-1 sm:order-1 sm:w-16 sm:flex-col sm:overflow-visible sm:pb-0">
                    {images.map((image, index) => {
                        const isSelected = activeImage === image;

                        return (
                            <button
                                key={`${image}-${index}`}
                                type="button"
                                onClick={() => setActiveImage(image)}
                                className={`group relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border bg-white p-1.5 transition ${
                                    isSelected
                                        ? "border-[var(--primary)] ring-2 ring-[var(--primary)]/20 shadow-2xs"
                                        : "border-[var(--border)] hover:border-[var(--lavender)]"
                                }`}
                            >
                                <img
                                    src={image}
                                    alt={`${variant.title} thumb ${index + 1}`}
                                    className="h-full w-full object-contain"
                                />
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Main Product Image Card - Generous height to fill page cleanly */}
            <div className="order-1 relative flex aspect-[4/3.8] min-h-[460px] max-h-[580px] flex-1 items-center justify-center overflow-hidden rounded-2xl border border-[var(--border)] bg-white p-6 sm:p-10">

                {/* Rating Badge */}
                <div className="absolute bottom-3.5 right-3.5 z-10 flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-white/95 px-2.5 py-1 text-xs font-semibold text-[var(--text-primary)] shadow-2xs backdrop-blur-xs">
                    <span>{rating}</span>
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                </div>

                {/* Main Image */}
                <img
                    src={activeImage}
                    alt={variant.title}
                    className="max-h-[440px] w-full object-contain transition duration-200 hover:scale-105"
                />

                {/* Mobile pagination indicator dots */}
                {images.length > 1 && (
                    <div className="absolute bottom-2.5 left-1/2 flex -translate-x-1/2 gap-1 sm:hidden">
                        {images.map((image, idx) => (
                            <span
                                key={idx}
                                className={`h-1.5 rounded-full transition-all ${
                                    activeImage === image
                                        ? "w-4 bg-[var(--primary)]"
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