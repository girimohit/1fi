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
        ...variant.images,
    ].filter(
        (image, index, array) =>
            array.indexOf(image) === index
    );

    const [activeImage, setActiveImage] = useState(
        images[0]
    );

    useEffect(() => {
        setActiveImage(images[0]);
    }, [variant.id]);

    return (
        <div className="flex flex-col gap-4 sm:flex-row">
            <div className="order-2 flex gap-3 overflow-x-auto sm:order-1 sm:w-20 sm:flex-col">
                {images.map((image, index) => (
                    <button
                        key={`${image}-${index}`}
                        type="button"
                        onClick={() => setActiveImage(image)}
                        className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border bg-white ${activeImage === image
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

            <div className="order-1 flex min-h-[360px] flex-1 items-center justify-center rounded-2xl bg-[#fafafa] p-6 sm:min-h-[500px] sm:p-8">
                <img
                    src={activeImage}
                    alt={variant.title}
                    className="max-h-[480px] w-full object-contain"
                />

                {variant.colorName && (
                    <span className="absolute rounded-md bg-[var(--primary)] px-3 py-1 text-xs font-semibold text-white">
                        {variant.colorName}
                    </span>
                )}
            </div>
        </div>
    );
}