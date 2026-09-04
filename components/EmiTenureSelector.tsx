"use client";

import { useState } from "react";
import { CreditCard } from "lucide-react";

import type { EmiPlan } from "@/types/product";

type EmiTenureSelectorProps = {
    plans: EmiPlan[];
};

function formatPrice(price: number) {
    return new Intl.NumberFormat("en-IN").format(price);
}

export default function EmiTenureSelector({
    plans,
}: EmiTenureSelectorProps) {
    const [selectedPlan, setSelectedPlan] = useState<EmiPlan | null>(
        plans[0] || null
    );

    if (!plans.length) {
        return (
            <div className="rounded-xl border border-[var(--border)] p-5">
                <p className="font-semibold">EMI plans unavailable</p>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-[var(--border)] bg-white p-5">
            <div className="flex items-center gap-2">
                <CreditCard
                    size={18}
                    className="text-[var(--primary)]"
                />

                <p className="font-semibold">
                    Choose EMI Tenure
                </p>
            </div>

            <div className="mt-4 divide-y divide-[var(--border)]">
                {plans.map((plan) => {
                    const selected = selectedPlan?.id === plan.id;

                    return (
                        <button
                            key={plan.id}
                            onClick={() => setSelectedPlan(plan)}
                            className="flex w-full items-center justify-between gap-4 py-4 text-left"
                        >
                            <div className="flex items-center gap-3">
                                <span
                                    className={`flex h-5 w-5 items-center justify-center rounded-full border ${selected
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
                                        ₹
                                        {formatPrice(
                                            Math.round(
                                                plan.cashbackAmount
                                                    ? 0
                                                    : 0
                                            )
                                        )}
                                    </p>

                                    <p className="text-sm text-[var(--text-secondary)]">
                                        {plan.tenureMonths} months
                                    </p>
                                </div>
                            </div>

                            <span className="rounded-md bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-600">
                                {Number(plan.interestRate) === 0
                                    ? "0% EMI"
                                    : `${plan.interestRate}%`}
                            </span>
                        </button>
                    );
                })}
            </div>

            {selectedPlan && (
                <button className="mt-4 w-full rounded-lg bg-[var(--primary)] py-3 text-sm font-semibold text-white transition hover:opacity-90">
                    Proceed with {selectedPlan.tenureMonths} months EMI
                </button>
            )}
        </div>
    );
}