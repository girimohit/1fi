"use client";

import { useEffect, useState } from "react";
import type { ProductVariant } from "@/types/product";

type ProductGalleryProps = {
    variant: ProductVariant;
};

export default function ProductGallery({
    variant,
}: ProductGalleryProps) {
    const images = [
        variant.imageUrl,
        ...(variant.images ?? []),
    ].filter(
        (image, index, array) => image && array.indexOf(image) === index
    );

    const [activeImage, setActiveImage] = useState(images[0]);

    useEffect(() => {
        setActiveImage(images[0]);
    }, [variant.id]);

    if (!images.length) {
        return (
            <div className="flex aspect-square items-center justify-center rounded-xl bg-[var(--gray)] text-sm text-[var(--text-muted)]">
                No image available
            </div>
        );
    }

    return (
        <div>
            <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-white">
                <div className="relative aspect-square">
                    <img
                        src={activeImage}
                        alt={variant.title}
                        className="h-full w-full object-contain p-6 sm:p-10"
                    />

                    {variant.colorName && (
                        <div className="absolute bottom-3 left-3 rounded-md bg-white/95 px-3 py-1.5 text-xs font-medium shadow-sm">
                            {variant.colorName}
                        </div>
                    )}
                </div>
            </div>

            {images.length > 1 && (
                <div className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
                    {images.map((image, index) => {
                        const selected = activeImage === image;

                        return (
                            <button
                                key={`${image}-${index}`}
                                type="button"
                                onClick={() => setActiveImage(image)}
                                className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border bg-white sm:h-20 sm:w-20 lg:h-20 lg:w-20 ${selected
                                        ? "border-[var(--primary)]"
                                        : "border-[var(--border)]"
                                    }`}
                            >
                                <img
                                    src={image}
                                    alt={`${variant.title} ${index + 1}`}
                                    className="h-full w-full object-contain p-1"
                                />
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}