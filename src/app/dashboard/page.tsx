"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

interface Invoice {
  id: string;
  invoice_number: string;
  client_name: string;
  total: number;
  currency: string;
  status: string;
  issue_date: string;
}

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-gray-100 text-gray-600",
  sent: "bg-blue-100 text-blue-700",
  paid: "bg-green-100 text-green-700",
  overdue: "bg-red-100 text-red-700",
};

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$", EUR: "€", GBP: "£", CNY: "¥",
  JPY: "¥", CAD: "C$", AUD: "A$", SGD: "S$",
  HKD: "HK$", KRW: "₩", THB: "฿", INR: "₹",
};

const FREE_MONTHLY_LIMIT = 5;

function startOfMonth(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), 1).toISOString();
}

export default function DashboardPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<string>("free");
  const [monthlyCount, setMonthlyCount] = useState(0);

  async function fetchData() {
    const { data: { user } } = await supabase().auth.getUser();
    if (!user) { setLoading(false); return; }

    const [{ data: invoiceData }, { data: profileData }] = await Promise.all([
      supabase()
        .from("invoices")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
      supabase().from("user_profiles").select("plan").eq("user_id", user.id).single(),
    ]);

    if (invoiceData) {
      setInvoices(invoiceData);
      const currentMonth = startOfMonth();
      const count = invoiceData.filter((inv) => inv.created_at && inv.created_at >= currentMonth).length;
      setMonthlyCount(count);
    }
    if (profileData) setPlan(profileData.plan || "free");
    setLoading(false);
  }

  useEffect(() => { fetchData(); }, []);

  const isFree = plan === "free";
  const atLimit = isFree && monthlyCount >= FREE_MONTHLY_LIMIT;

  const totalPaid = invoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.total, 0);
  const totalOutstanding = invoices.filter((i) => i.status === "sent").reduce((s, i) => s + i.total, 0);
  const totalOverdue = invoices.filter((i) => i.status === "overdue").reduce((s, i) => s + i.total, 0);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Delete this invoice?")) return;
    await supabase().from("invoices").delete().eq("id", id);
    fetchData();
  };

  const handleStatusChange = async (id: string, newStatus: string, e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    await supabase().from("invoices").update({ status: newStatus }).eq("id", id);
    fetchData();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${plan === "business" ? "bg-purple-100 text-purple-700" : plan === "pro" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>
              {plan}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            {isFree ? `${monthlyCount}/${FREE_MONTHLY_LIMIT} invoices this month` : "Unlimited invoices"}
          </p>
        </div>
        {atLimit ? (
          <Link href="/pricing" className="rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-400">
            Upgrade to Pro
          </Link>
        ) : (
          <Link href="/dashboard/invoices/new" className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500">
            + New Invoice
          </Link>
        )}
      </div>

      {atLimit && (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          You&apos;ve reached the free plan limit of {FREE_MONTHLY_LIMIT} invoices this month. Upgrade to Pro for unlimited invoices.
        </div>
      )}

      <div className="mt-8 grid grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: `${CURRENCY_SYMBOLS.USD}${totalPaid.toLocaleString()}`, color: "text-green-600" },
          { label: "Outstanding", value: `${CURRENCY_SYMBOLS.USD}${totalOutstanding.toLocaleString()}`, color: "text-yellow-600" },
          { label: "Overdue", value: `${CURRENCY_SYMBOLS.USD}${totalOverdue.toLocaleString()}`, color: "text-red-600" },
          { label: "Total Invoices", value: String(invoices.length), color: "text-blue-600" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="text-xs text-gray-500">{stat.label}</div>
            <div className={`mt-1 text-2xl font-bold ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-sm font-semibold text-gray-900">Recent Invoices</h2>
        </div>
        {loading ? (
          <div className="px-6 py-12 text-center text-sm text-gray-400">Loading...</div>
        ) : invoices.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-gray-400">No invoices yet</p>
            <Link href="/dashboard/invoices/new" className="mt-2 inline-block text-sm font-medium text-blue-600 hover:underline">Create your first invoice →</Link>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs text-gray-500">
                <th className="px-6 py-3">Invoice</th><th className="px-6 py-3">Client</th><th className="px-6 py-3">Amount</th><th className="px-6 py-3">Status</th><th className="px-6 py-3">Date</th><th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} onClick={() => router.push(`/dashboard/invoices/${inv.id}`)} className="cursor-pointer border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{inv.invoice_number}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{inv.client_name}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{formatAmount(inv.total, inv.currency)}</td>
                  <td className="px-6 py-4">
                    <select
                      value={inv.status}
                      onChange={(e) => handleStatusChange(inv.id, e.target.value, e)}
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium border-0 cursor-pointer ${STATUS_COLORS[inv.status] || "bg-gray-100 text-gray-600"}`}
                    >
                      <option value="draft">draft</option>
                      <option value="sent">sent</option>
                      <option value="paid">paid</option>
                      <option value="overdue">overdue</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{inv.issue_date}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={(e) => handleDelete(inv.id, e)} className="text-xs text-red-500 hover:text-red-700">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function formatAmount(amount: number, currency: string) {
  return `${CURRENCY_SYMBOLS[currency] || "$"}${amount.toLocaleString()}`;
}
