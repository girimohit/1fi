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
        // { label: "How it Works", href: "/#how-it-works" },
        { label: "Shop", href: "/#products" },
    ];

    return (
        <header className="sticky top-3 z-40 w-full px-4">
            <div className="mx-auto w-full md:w-[72%] max-w-5xl">
                <nav className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-white/95 px-4 py-2 shadow-md backdrop-blur-md transition-all sm:px-6">
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)] text-white shadow-xs transition group-hover:scale-105">
                            <span className="text-sm font-black tracking-tight">
                                1Fi
                            </span>
                        </div>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center gap-2 lg:gap-5">
                        {navLinks.map((link) => {
                            const isActive =
                                link.href === "/"
                                    ? pathname === "/"
                                    : pathname.startsWith(link.href);

                            return (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    className={`px-2 py-1 text-sm font-semibold transition-colors ${isActive
                                            ? "text-[var(--primary)]"
                                            : "text-black hover:text-[var(--primary)]"
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>

                    {/* CTA */}
                    <div className="hidden md:flex items-center">
                        <Link
                            href="/"
                            className="group flex items-center gap-1.5 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-bold text-white shadow-xs transition hover:opacity-95 active:scale-[0.98]"
                        >
                            <span>Shop Now</span>
                            <ArrowUpRight
                                size={14}
                                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            />
                        </Link>
                    </div>

                    {/* Mobile Hamburger Toggle */}
                    <div className="flex md:hidden">
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="rounded-lg p-1 text-black hover:bg-gray-100"
                            aria-label="Toggle navigation menu"
                        >
                            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </nav>

                {/* Mobile Drawer Menu */}
                {mobileMenuOpen && (
                    <div className="mt-2 rounded-2xl border border-[var(--border)] bg-white p-3 shadow-lg md:hidden">
                        <div className="flex flex-col gap-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="rounded-lg px-3 py-2 text-sm font-semibold text-black hover:bg-[var(--primary-light)] hover:text-[var(--primary)]"
                                >
                                    {link.label}
                                </Link>
                            ))}

                            <Link
                                href="/"
                                onClick={() => setMobileMenuOpen(false)}
                                className="mt-2 flex items-center justify-center gap-1 rounded-lg bg-[var(--primary)] py-2 text-sm font-bold text-white shadow-xs"
                            >
                                <span>Shop Now</span>
                                <ArrowUpRight size={14} />
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </header>

    );
}
