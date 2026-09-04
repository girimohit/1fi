"use client";

import { useState } from "react";
import { CreditCard, Check } from "lucide-react";

import type { EmiPlan } from "@/types/product";
import { calculateEmi, formatPrice } from "@/lib/emi";

type EmiTenureSelectorProps = {
    plans: EmiPlan[];
    productPrice: number;
    onProceed: (plan: EmiPlan) => void;
};

export default function EmiTenureSelector({
    plans,
    productPrice,
    onProceed,
}: EmiTenureSelectorProps) {
    const [selectedPlan, setSelectedPlan] = useState<EmiPlan | null>(
        plans[0] ?? null
    );

    if (!plans.length) {
        return (
            <div className="rounded-xl border border-[var(--border)] p-5">
                <p className="font-semibold">EMI plans unavailable</p>
            </div>
        );
    }

    const selectedEmi = selectedPlan
        ? calculateEmi(
            productPrice,
            Number(selectedPlan.interestRate),
            selectedPlan.tenureMonths
        )
        : 0;

    return (
        <div className="rounded-xl border border-[var(--border)] bg-white p-5">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <CreditCard
                        size={18}
                        className="text-[var(--primary)]"
                    />

                    <p className="font-semibold">Choose EMI Tenure</p>
                </div>

                <span className="text-xs text-[var(--text-muted)]">
                    Flexible plans
                </span>
            </div>

            <div className="mt-4 divide-y divide-[var(--border)]">
                {plans.map((plan) => {
                    const selected = selectedPlan?.id === plan.id;

                    const monthlyEmi = calculateEmi(
                        productPrice,
                        Number(plan.interestRate),
                        plan.tenureMonths
                    );

                    return (
                        <button
                            key={plan.id}
                            type="button"
                            onClick={() => setSelectedPlan(plan)}
                            className="flex w-full items-center justify-between gap-4 py-4 text-left"
                        >
                            <div className="flex items-center gap-3">
                                <span
                                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${selected
                                        ? "border-[var(--primary)]"
                                        : "border-gray-300"
                                        }`}
                                >
                                    {selected && (
                                        <span className="h-2.5 w-2.5 rounded-full bg-[var(--primary)]" />
                                    )}
                                </span>

                                <div>
                                    <p className="text-sm font-semibold">
                                        ₹{formatPrice(monthlyEmi)} ×{" "}
                                        {plan.tenureMonths} months
                                    </p>

                                    {plan.cashbackText && (
                                        <p className="mt-1 text-xs text-green-600">
                                            {plan.cashbackText}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <span className="shrink-0 rounded-md bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-600">
                                {Number(plan.interestRate) === 0
                                    ? "0% EMI"
                                    : `${plan.interestRate}%`}
                            </span>
                        </button>
                    );
                })}
            </div>

            {selectedPlan && (
                <>
                    <div className="mt-4 rounded-lg bg-[var(--primary-light)] px-4 py-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-[var(--text-secondary)]">
                                Monthly EMI
                            </span>

                            <span className="font-bold text-[var(--primary)]">
                                ₹{formatPrice(selectedEmi)}
                            </span>
                        </div>

                        {selectedPlan.cashbackAmount && (
                            <div className="mt-1 flex items-center justify-between text-xs">
                                <span className="text-[var(--text-secondary)]">
                                    Cashback
                                </span>

                                <span className="font-semibold text-green-600">
                                    ₹{formatPrice(selectedPlan.cashbackAmount)}
                                </span>
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() => onProceed(selectedPlan)}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--primary)] py-3 text-sm font-semibold text-white transition hover:opacity-90"
                    >
                        <Check size={17} />
                        Proceed with {selectedPlan.tenureMonths} months EMI
                    </button>
                </>
            )}
        </div>
    );
}        