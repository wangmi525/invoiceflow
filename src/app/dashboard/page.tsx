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

export default function DashboardPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchInvoices() {
    const { data: { user } } = await supabase().auth.getUser();
    if (!user) { setLoading(false); return; }
    const { data } = await supabase()
      .from("invoices")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (data) setInvoices(data);
    setLoading(false);
  }

  useEffect(() => { fetchInvoices(); }, []);

  const totalPaid = invoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.total, 0);
  const totalOutstanding = invoices.filter((i) => i.status === "sent").reduce((s, i) => s + i.total, 0);
  const totalOverdue = invoices.filter((i) => i.status === "overdue").reduce((s, i) => s + i.total, 0);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Delete this invoice?")) return;
    await supabase().from("invoices").delete().eq("id", id);
    fetchInvoices();
  };

  const handleStatusChange = async (id: string, newStatus: string, e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    await supabase().from("invoices").update({ status: newStatus }).eq("id", id);
    fetchInvoices();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="mt-1 text-sm text-gray-500">Manage and track all your invoices</p>
        </div>
        <Link href="/dashboard/invoices/new" className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500">
          + New Invoice
        </Link>
      </div>

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
