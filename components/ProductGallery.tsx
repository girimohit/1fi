"use client";

import { useState } from "react";
import { Star } from "lucide-react";

type ProductGalleryProps = {
    images: string[];
    productName: string;
    cashback?: string;
    rating?: number;
};

export default function ProductGallery({
    images,
    productName,
    cashback = "1% Cashback",
    rating = 4.2,
}: ProductGalleryProps) {
    const [activeImage, setActiveImage] = useState(0);

    const displayImages = images.length > 0 ? images : ["/placeholder.png"];

    return (
        <div className="relative">
            <div className="flex gap-4">
                {/* Thumbnail column */}
                <div className="hidden w-20 shrink-0 flex-col gap-3 sm:flex">
                    {displayImages.map((image, index) => (
                        <button
                            key={`${image}-${index}`}
                            type="button"
                            onClick={() => setActiveImage(index)}
                            className={`flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl border bg-white transition ${activeImage === index
                                ? "border-[var(--primary)]"
                                : "border-[var(--border)] hover:border-[var(--lavender)]"
                                }`}
                        >
                            <img
                                src={image}
                                alt={`${productName} view ${index + 1}`}
                                className="h-full w-full object-contain p-1"
                            />
                        </button>
                    ))}
                </div>

                <div className="relative flex min-h-[420px] flex-1 items-center justify-center rounded-2xl bg-white">
                    <img
                        src={displayImages[activeImage]}
                        alt={productName}
                        className="max-h-[500px] w-full object-contain"
                    />

                    {/* Cashback */}
                    <span className="absolute bottom-4 left-4 rounded-md bg-[#159ac0] px-3 py-1.5 text-sm font-semibold text-white">
                        {cashback}
                    </span>

                    {/* Rating */}
                    <span className="absolute bottom-4 right-4 inline-flex items-center gap-1 rounded-md bg-white px-2.5 py-1.5 text-sm font-medium shadow-sm">
                        {rating.toFixed(1)}
                        <Star
                            size={13}
                            fill="#f5b800"
                            className="text-[#f5b800]"
                        />
                    </span>
                </div>
            </div>

            {/* Mobile thumbnails */}
            <div className="mt-3 flex justify-center gap-1.5 sm:hidden">
                {displayImages.map((image, index) => (
                    <button
                        key={`${image}-mobile-${index}`}
                        type="button"
                        onClick={() => setActiveImage(index)}
                        className={`h-1.5 rounded-full transition-all ${activeImage === index
                            ? "w-5 bg-[var(--text-primary)]"
                            : "w-1.5 bg-[var(--lavender)]"
                            }`}
                        aria-label={`View image ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}