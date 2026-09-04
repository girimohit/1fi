import Link from "next/link";

export default function Footer() {
    return (
        <footer className="mt-auto border-t border-[var(--border)] bg-white py-8 text-xs text-[var(--text-secondary)]">
            <div className="mx-auto flex max-w-[1500px] flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-8 lg:px-12">
                {/* Brand and Copyright */}
                <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--primary)] text-white">
                        <span className="text-xs font-black tracking-tight">1Fi</span>
                    </div>
                    {/* <span>© {new Date().getFullYear()} 1Fi. All rights reserved.</span> */}
                </div>

                {/* Minimal Links */}
                <div className="flex flex-wrap items-center gap-6">
                    <Link href="/" className="hover:text-[var(--primary)] transition">
                        Terms of Service
                    </Link>
                    <Link href="/" className="hover:text-[var(--primary)] transition">
                        Support
                    </Link>
                    <Link href="/" className="hover:text-[var(--primary)] transition">
                        Contact
                    </Link>
                </div>
            </div>
        </footer>
    );
}
