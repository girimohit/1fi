import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const { variantId, emiPlanId, applicantName, applicantPhone, applicantEmail } = body;

        // Basic validation
        if (!variantId || !emiPlanId || !applicantName || !applicantPhone) {
            return NextResponse.json(
                {
                    success: false,
                    error: "variantId, emiPlanId, applicantName and applicantPhone are required",
                },
                { status: 400 },
            );
        }

        // check if the selected EMI plan exists
        const emiPlan = await prisma.emiPlan.findUnique({
            where: {
                id: emiPlanId,
            },
            select: {
                id: true,
                variantId: true,
            },
        });

        if (!emiPlan) {
            return NextResponse.json(
                {
                    success: false,
                    error: "EMI plan not found",
                },
                { status: 404 },
            );
        }

        // to avoid selecting EMI plan which belongs to another variant
        if (emiPlan.variantId !== variantId) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Selected EMI plan does not belong to this variant",
                },
                { status: 400 },
            );
        }

        // to check whether  variant exists and is available
        const variant = await prisma.productVariant.findUnique({
            where: {
                id: variantId,
            },
            select: {
                id: true,
                stockQuantity: true,
            },
        });

        if (!variant) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Product variant not found",
                },
                { status: 404 },
            );
        }

        if (variant.stockQuantity <= 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: "This variant is currently out of stock",
                },
                { status: 400 },
            );
        }

        const application = await prisma.planApplication.create({
            data: {
                variantId,
                emiPlanId,
                applicantName: applicantName.trim(),
                applicantPhone: applicantPhone.trim(),
                applicantEmail: applicantEmail?.trim() || null,
            },

            select: {
                id: true,
                applicantName: true,
                status: true,
                createdAt: true,

                variant: {
                    select: {
                        title: true,
                        product: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },

                emiPlan: {
                    select: {
                        tenureMonths: true,
                        interestRate: true,
                        cashbackAmount: true,
                        tag: true,
                    },
                },
            },
        });

        return NextResponse.json(
            {
                success: true,
                message: "EMI application submitted successfully",
                data: application,
            },
            { status: 201 },
        );
    } catch (error) {
        console.error("POST /api/applications error:", error);

        return NextResponse.json(
            {
                success: false,
                error: "Failed to submit application",
            },
            { status: 500 },
        );
    }
}
