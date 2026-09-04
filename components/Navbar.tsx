"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/#about" },
    { label: "Shop", href: "/#products" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full px-3 py-3 sm:px-4">
      <div className="mx-auto w-full max-w-7xl">
        <nav className="flex min-h-12 items-center justify-between rounded-xl border border-[var(--border)] bg-white/95 px-3 py-2 shadow-sm backdrop-blur-md sm:min-h-14 sm:px-5">
          {/* Logo */}
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2.5"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)] text-white sm:h-9 sm:w-9">
              <span className="text-xs font-black tracking-tight sm:text-sm">
                1Fi
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 md:flex lg:gap-3">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-[var(--primary-light)] text-[var(--primary)]"
                      : "text-[var(--text-secondary)] hover:bg-[var(--gray)] hover:text-[var(--primary)]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex">
            <Link
              href="/"
              className="group flex items-center gap-1.5 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-bold !text-white transition hover:opacity-90 active:scale-[0.98]"
            >
              <span>Shop Now</span>

              <ArrowUpRight
                size={14}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--text-primary)] transition hover:bg-[var(--gray)] md:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mt-2 overflow-hidden rounded-xl border border-[var(--border)] bg-white p-2 shadow-md md:hidden">
            <div className="flex flex-col">
              {navLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);

                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                      isActive
                        ? "bg-[var(--primary-light)] text-[var(--primary)]"
                        : "text-[var(--text-primary)] hover:bg-[var(--gray)]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}

              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-2 flex items-center justify-center gap-1.5 rounded-lg bg-[var(--primary)] py-2.5 text-sm font-bold !text-white"
              >
                Shop Now
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
