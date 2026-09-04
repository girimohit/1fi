"use client";

import { FormEvent, useState } from "react";
import { Check, Loader2, X } from "lucide-react";

import type { EmiPlan, ProductVariant } from "@/types/product";

type ApplicationModalProps = {
  variant: ProductVariant;
  plan: EmiPlan;
  productName: string;
  onClose: () => void;
};

export default function ApplicationModal({
  variant,
  plan,
  productName,
  onClose,
}: ApplicationModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [applicationId, setApplicationId] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (name.trim().length < 2) {
      setError("Please enter your name.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    if (email && !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          variantId: variant.id,
          emiPlanId: plan.id,
          applicantName: name.trim(),
          applicantPhone: phone.trim(),
          applicantEmail: email.trim() || undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to submit application.");
      }

      setApplicationId(result.data.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (applicationId) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
          {/* <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                        <Check size={24} />
                    </div> */}

          <div className="mt-4 text-center">
            <h2 className="text-xl font-bold">Application submitted</h2>

            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Your EMI application has been received successfully.
            </p>

            <div className="mt-5 rounded-lg bg-[var(--gray)] p-3 text-left">
              <p className="text-xs text-[var(--text-muted)]">Reference ID</p>

              <p className="mt-1 break-all text-sm font-semibold">
                {applicationId}
              </p>
            </div>

            <button
              onClick={onClose}
              className="mt-5 w-full rounded-lg bg-[var(--primary)] py-3 text-sm font-semibold text-white"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Apply for EMI</h2>

            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Enter your details.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 hover:bg-[var(--gray)]"
          >
            <X size={19} />
          </button>
        </div>

        <div className="mt-5 rounded-lg bg-[var(--primary-light)] p-3">
          <p className="text-sm font-semibold">{productName}</p>

          <p className="mt-1 text-xs text-[var(--text-secondary)]">
            {variant.title} · {plan.tenureMonths} months EMI
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Full name
            </label>

            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Rahul Sharma"
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm outline-none focus:border-[var(--primary)]"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Mobile number
            </label>

            <input
              value={phone}
              onChange={(event) =>
                setPhone(event.target.value.replace(/\D/g, "").slice(0, 10))
              }
              placeholder="9876543210"
              inputMode="numeric"
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm outline-none focus:border-[var(--primary)]"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Email
              <span className="ml-1 text-xs text-[var(--text-muted)]">
                optional
              </span>
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="rahul@example.com"
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm outline-none focus:border-[var(--primary)]"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--primary)] py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && <Loader2 size={17} className="animate-spin" />}

            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
}
