"use client";

import { useState } from "react";
import type { ProductVariant } from "@/types/product";

type ProductGalleryProps = {
    variant: ProductVariant;
};

export default function ProductGallery({
    variant,
}: ProductGalleryProps) {
    const images = [variant.imageUrl, ...variant.images].filter(
        (image, index, array) => array.indexOf(image) === index
    );

    const [activeImage, setActiveImage] = useState(images[0]);

    return (
        <div className="flex gap-4">
            <div className="hidden w-20 flex-col gap-3 sm:flex">
                {images.map((image, index) => (
                    <button
                        key={`${image}-${index}`}
                        onClick={() => setActiveImage(image)}
                        className={`flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl border bg-white ${activeImage === image
                                ? "border-[var(--primary)]"
                                : "border-[var(--border)]"
                            }`}
                    >
                        <img
                            src={image}
                            alt={`${variant.title} view ${index + 1}`}
                            className="h-full w-full object-contain p-2"
                        />
                    </button>
                ))}
            </div>

            <div className="relative flex min-h-[420px] flex-1 items-center justify-center rounded-2xl bg-[#fafafa] p-8">
                <img
                    src={activeImage}
                    alt={variant.title}
                    className="max-h-[500px] w-full object-contain"
                />

                {variant.colorName && (
                    <span className="absolute bottom-5 left-5 rounded-md bg-[var(--primary)] px-3 py-1 text-xs font-semibold text-white">
                        {variant.colorName}
                    </span>
                )}
            </div>
        </div>
    );
}