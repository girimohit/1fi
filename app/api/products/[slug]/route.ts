import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type RouteContext = {
    params: Promise<{
        slug: string;
    }>;
};

export async function GET(
    _request: NextRequest,
    { params }: RouteContext
) {
    try {
        const { slug } = await params;

        const product = await prisma.product.findUnique({
            where: {
                slug,
            },

            select: {
                id: true,
                name: true,
                slug: true,
                brand: true,
                badge: true,
                description: true,
                specs: true,

                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },

                variants: {
                    orderBy: [
                        {
                            isDefault: "desc",
                        },
                        {
                            price: "asc",
                        },
                    ],

                    select: {
                        id: true,
                        title: true,
                        sku: true,
                        colorName: true,
                        colorHex: true,
                        attributes: true,
                        mrp: true,
                        price: true,
                        imageUrl: true,
                        images: true,
                        isDefault: true,
                        stockQuantity: true,

                        emiPlans: {
                            orderBy: {
                                tenureMonths: "asc",
                            },

                            select: {
                                id: true,
                                tenureMonths: true,
                                interestRate: true,
                                cashbackAmount: true,
                                cashbackText: true,
                                tag: true,
                            },
                        },
                    },
                },
            },
        });

        if (!product) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Product not found",
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: product,
        });
    } catch (error) {
        console.error("error in GET/api/products/[slug] :", error);

        return NextResponse.json(
            {
                success: false,
                error: "Failed to fetch product",
            },
            { status: 500 }
        );
    }
}