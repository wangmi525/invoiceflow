"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold text-blue-900">
          InvoiceFlow
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/pricing" className="text-sm text-gray-600 hover:text-gray-900">
            Pricing
          </Link>
          <Link href="/auth" className="text-sm text-gray-600 hover:text-gray-900">
            Log In
          </Link>
          <Link
            href="/auth?tab=signup"
            className="rounded-lg bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
          >
            Get Started Free
          </Link>
        </div>
      </div>
    </nav>
  );
}
