"use client";

import { useState } from "react";
import { Shield } from "lucide-react";
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
            <div className="rounded-2xl border border-[var(--border)] bg-white p-5">
                <p className="font-semibold text-[var(--text-primary)]">EMI plans unavailable</p>
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                    No EMI tenures are currently configured for this variant.
                </p>
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
        <div className="space-y-4">
            {/* Higher Credit Instantly / Mutual Fund Backing Card */}
            <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--primary-light)]/40 p-3.5 shadow-xs">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary)] text-white shadow-xs">
                        <Shield size={18} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-[var(--text-primary)]">
                            Higher Credit Instantly
                        </p>
                        <p className="text-[11px] text-[var(--text-secondary)]">
                            Backed by 1Fi Mutual Funds • No paperwork
                        </p>
                    </div>
                </div>
                <span className="rounded-md bg-[var(--primary-light)] px-2 py-1 text-[11px] font-semibold text-[var(--primary)]">
                    Zero Cost
                </span>
            </div>

            {/* Choose EMI Tenure Container */}
            <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-xs">
                {/* Header with zero down-payment callout */}
                <div className="border-b border-[var(--border)] bg-[var(--gray)]/50 p-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-[var(--primary)]">
                        <span className="rounded bg-[var(--primary-light)] px-1.5 py-0.5 text-[10px]">PROMO</span>
                        <span>Pay only ₹0 now (Zero Down Payment)</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                        <h3 className="text-sm font-bold text-[var(--text-primary)] sm:text-base">
                            Choose EMI Tenure
                        </h3>
                        <span className="text-[11px] font-medium text-[var(--text-muted)]">
                            EMIs backed by MF
                        </span>
                    </div>
                </div>

                {/* Plan Options Radio List */}
                <div className="divide-y divide-[var(--border)] px-4">
                    {plans.map((plan) => {
                        const isSelected = selectedPlan?.id === plan.id;
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
                                className={`group flex w-full items-center justify-between gap-3 py-4 text-left transition ${
                                    isSelected ? "bg-[var(--primary-light)]/20 -mx-4 px-4" : "hover:bg-[var(--gray)]/30"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    {/* Radio Indicator */}
                                    <div
                                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition ${
                                            isSelected
                                                ? "border-[var(--primary)] bg-white"
                                                : "border-[var(--border)] group-hover:border-[var(--lavender)]"
                                        }`}
                                    >
                                        {isSelected && (
                                            <div className="h-2.5 w-2.5 rounded-full bg-[var(--primary)]" />
                                        )}
                                    </div>

                                    <div>
                                        <div className="flex items-baseline gap-1.5">
                                            <span className="text-sm font-bold text-[var(--text-primary)] sm:text-base">
                                                ₹{formatPrice(monthlyEmi)}
                                            </span>
                                            <span className="text-xs text-[var(--text-muted)]">
                                                x {plan.tenureMonths} months
                                            </span>
                                        </div>

                                        {plan.cashbackText ? (
                                            <p className="mt-0.5 text-[11px] font-semibold text-emerald-600">
                                                {plan.cashbackText}
                                            </p>
                                        ) : plan.cashbackAmount ? (
                                            <p className="mt-0.5 text-[11px] font-semibold text-emerald-600">
                                                Additional cashback of ₹{formatPrice(plan.cashbackAmount)}
                                            </p>
                                        ) : null}
                                    </div>
                                </div>

                                {/* Interest Tag Badge */}
                                <span
                                    className={`shrink-0 rounded-md px-2.5 py-1 text-xs font-bold uppercase tracking-tight ${
                                        Number(plan.interestRate) === 0
                                            ? "bg-[var(--primary)] text-white shadow-2xs"
                                            : "border border-[var(--border)] bg-[var(--gray)] text-[var(--text-secondary)]"
                                    }`}
                                >
                                    {Number(plan.interestRate) === 0 ? "0% EMI" : `${plan.interestRate}% Int`}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Footnote */}
                <div className="border-t border-[var(--border)] bg-[var(--gray)]/30 px-4 py-2.5 text-[11px] text-[var(--text-muted)]">
                    *Total extra payment per month/order value. Zero hidden charges.
                </div>
            </div>

            {/* Selected Plan Summary & Primary CTA Button */}
            {selectedPlan && (
                <div className="space-y-3 pt-2">
                    <button
                        type="button"
                        onClick={() => onProceed(selectedPlan)}
                        className="group flex w-full flex-col items-center justify-center rounded-xl bg-[var(--primary)] py-3.5 px-5 text-white shadow-sm transition hover:opacity-90 active:scale-[0.99]"
                    >
                        <span className="text-base font-bold tracking-tight">
                            Buy on {selectedPlan.tenureMonths} months EMI
                        </span>
                        <span className="mt-0.5 text-xs text-white/90">
                            {selectedPlan.cashbackAmount
                                ? `Earn ₹${formatPrice(selectedPlan.cashbackAmount)} cashback on this order`
                                : `₹${formatPrice(selectedEmi)}/month • Instant Approval`}
                        </span>
                    </button>
                </div>
            )}
        </div>
    );
}