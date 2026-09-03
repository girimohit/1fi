import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const category = searchParams.get("category");
    const brand = searchParams.get("brand");
    const search = searchParams.get("search");

    const products = await prisma.product.findMany({
      where: {
        isActive: true,

        ...(category && {
          category: {
            slug: category,
          },
        }),
        ...(brand && {
          brand: {
            equals: brand,
            mode: "insensitive",
          },
        }),
        ...(search && {
          name: {
            contains: search,
            mode: "insensitive",
          },
        }),
      },
      select: {
        id: true,
        name: true,
        slug: true,
        brand: true,
        badge: true,
        description: true,
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
        variants: {
          where: {
            isDefault: true,
          },
          select: {
            id: true,
            title: true,
            sku: true,
            mrp: true,
            price: true,
            imageUrl: true,
            stockQuantity: true,
          },
          take: 1,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("Get api/products error : ", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch products",
      },
      { status: 500 },
    );
  }
}
