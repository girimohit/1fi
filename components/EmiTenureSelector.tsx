"use client";

import { useState } from "react";
import { ShieldCheck, ArrowRight } from "lucide-react";
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
            <div className="rounded-xl border border-[var(--border)] p-4 text-center">
                <p className="text-sm font-semibold text-[var(--text-primary)]">
                    No EMI Plans Available
                </p>
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                    Full upfront payment available at checkout.
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-[var(--border)] bg-white p-4 shadow-xs space-y-3.5">
            {/* Simple Clean Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-bold text-[var(--text-primary)]">
                        Select EMI Plan
                    </h3>
                    <p className="text-xs text-[var(--text-muted)]">
                        ₹0 Down Payment • Backed by 1Fi Mutual Funds
                    </p>
                </div>
                <span className="text-xs font-semibold text-[var(--primary)]">
                    0% Foreclosure
                </span>
            </div>

            {/* Flat, Non-nested Plan List */}
            <div className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
                {plans.map((plan) => {
                    const isSelected = selectedPlan?.id === plan.id;
                    const monthlyEmi = calculateEmi(
                        productPrice,
                        Number(plan.interestRate),
                        plan.tenureMonths
                    );
                    const isZeroInterest = Number(plan.interestRate) === 0;

                    return (
                        <button
                            key={plan.id}
                            type="button"
                            onClick={() => setSelectedPlan(plan)}
                            className={`flex w-full items-center justify-between gap-3 py-3 px-2 text-left transition ${
                                isSelected
                                    ? "bg-[var(--primary-light)]/30 font-medium text-[var(--text-primary)]"
                                    : "hover:bg-gray-50/60"
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                {/* Radio Circle */}
                                <div
                                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition ${
                                        isSelected
                                            ? "border-[var(--primary)] bg-white"
                                            : "border-gray-300"
                                    }`}
                                >
                                    {isSelected && (
                                        <div className="h-2 w-2 rounded-full bg-[var(--primary)]" />
                                    )}
                                </div>

                                <div>
                                    <p className="text-sm font-bold text-[var(--text-primary)]">
                                        ₹{formatPrice(monthlyEmi)} <span className="text-xs font-normal text-[var(--text-secondary)]">x {plan.tenureMonths} months</span>
                                    </p>
                                    {plan.cashbackAmount ? (
                                        <p className="text-[11px] font-medium text-emerald-600">
                                            +₹{formatPrice(plan.cashbackAmount)} cashback
                                        </p>
                                    ) : null}
                                </div>
                            </div>

                            {/* Tag Badge */}
                            <span
                                className={`rounded px-2 py-0.5 text-[11px] font-bold ${
                                    isZeroInterest
                                        ? "bg-[var(--primary)] text-white"
                                        : "border border-[var(--border)] text-[var(--text-secondary)]"
                                }`}
                            >
                                {isZeroInterest ? "0% EMI" : `${plan.interestRate}% EMI`}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* CTA Button */}
            {selectedPlan && (
                <div className="pt-1">
                    <button
                        type="button"
                        onClick={() => onProceed(selectedPlan)}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary)] py-3 px-4 text-white font-bold text-sm shadow-xs transition hover:opacity-95 active:scale-[0.99]"
                    >
                        <span>
                            Buy on {selectedPlan.tenureMonths} months EMI
                        </span>
                        <ArrowRight size={15} />
                    </button>

                    <div className="flex items-center justify-center gap-1.5 pt-2 text-[11px] text-[var(--text-muted)]">
                        <ShieldCheck size={13} className="text-[var(--primary)]" />
                        <span>Instant approval backed by Mutual Funds</span>
                    </div>
                </div>
            )}
        </div>
    );
}