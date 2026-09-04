import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: {
        products: {
          some: { isActive: true },
        },
      },
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        slug: true,
        icon: true,
      },
    });
    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Error while fetching categories: ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch categories",
      },
      {
        status: 500,
      },
    );
  }
}
