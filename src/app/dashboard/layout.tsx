"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

const NAV = [
  { href: "/dashboard", label: "Invoices", icon: "📄" },
  { href: "/dashboard/customers", label: "Clients", icon: "👤" },
  { href: "/dashboard/settings", label: "Settings", icon: "⚙️" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push("/auth"); return; }
      setAuthed(true);
    });
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };

  if (!authed) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="flex w-60 flex-col border-r border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-6 py-5">
          <Link href="/" className="text-lg font-bold text-blue-900">
            InvoiceFlow
          </Link>
        </div>
        <nav className="flex-1 px-3 py-4">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                pathname === item.href
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-gray-200 px-6 py-4">
          <div className="text-xs text-gray-400">Free Plan</div>
          <Link href="/pricing" className="mt-1 block text-xs font-medium text-blue-600 hover:underline">
            Upgrade to Pro →
          </Link>
          <button
            onClick={handleLogout}
            className="mt-3 block w-full text-left text-xs font-medium text-red-500 hover:text-red-700"
          >
            Log Out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  );
}
