"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { generateInvoicePDF } from "@/lib/pdf-generator";

const CURRENCIES = [
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "CNY", symbol: "¥" },
  { code: "JPY", symbol: "¥" },
  { code: "CAD", symbol: "C$" },
  { code: "AUD", symbol: "A$" },
  { code: "SGD", symbol: "S$" },
  { code: "HKD", symbol: "HK$" },
  { code: "KRW", symbol: "₩" },
  { code: "THB", symbol: "฿" },
  { code: "INR", symbol: "₹" },
];

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export default function NewInvoicePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [clients, setClients] = useState<{id: string; name: string; email: string; address: string}[]>([]);

  useEffect(() => {
    async function loadClients() {
      const { data: { user } } = await supabase().auth.getUser();
      if (!user) return;
      const { data } = await supabase().from("customers").select("*").eq("user_id", user.id).order("name");
      if (data) setClients(data);
    }
    loadClients();
  }, []);

  const [form, setForm] = useState({
    invoiceNumber: `INV-${String(Date.now()).slice(-4)}`,
    clientName: "",
    clientEmail: "",
    clientAddress: "",
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    currency: "USD",
    taxRate: 0,
    notes: "",
  });

  const [items, setItems] = useState<LineItem[]>([
    { id: uid(), description: "", quantity: 1, rate: 0 },
  ]);

  const symbol = CURRENCIES.find((c) => c.code === form.currency)?.symbol || "$";
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
  const taxAmount = subtotal * (form.taxRate / 100);
  const total = subtotal + taxAmount;

  const addItem = () => setItems([...items, { id: uid(), description: "", quantity: 1, rate: 0 }]);
  const removeItem = (id: string) => setItems(items.filter((i) => i.id !== id));
  const updateItem = (id: string, field: keyof LineItem, value: string | number) => {
    setItems(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  };

  const buildInvoice = (status: "draft" | "sent") => ({
    invoice_number: form.invoiceNumber,
    client_name: form.clientName,
    client_email: form.clientEmail,
    client_address: form.clientAddress,
    issue_date: form.issueDate,
    due_date: form.dueDate,
    currency: form.currency,
    items: items.map((item) => ({ ...item, amount: item.quantity * item.rate })),
    subtotal,
    tax_rate: form.taxRate,
    tax_amount: taxAmount,
    total,
    notes: form.notes,
    status,
  });

  const handleSave = async (status: "draft" | "sent") => {
    setSaving(true);
    const { data: { user } } = await supabase().auth.getUser();
    if (!user) { setSaving(false); alert("Please log in first"); return; }
    const invoice = { ...buildInvoice(status), user_id: user.id };
    const { error } = await supabase().from("invoices").insert(invoice);
    setSaving(false);
    if (error) {
      alert("Save failed: " + error.message);
      return;
    }
    router.push("/dashboard");
  };

  const handleDownloadPDF = useCallback(async () => {
    setDownloading(true);
    try {
      const { data: { user } } = await supabase().auth.getUser();
      let companyName = "";
      let companyAddress = "";
      if (user) {
        const { data: profile } = await supabase().from("user_profiles").select("company_name, company_address").eq("user_id", user.id).single();
        if (profile) {
          companyName = profile.company_name || "";
          companyAddress = profile.company_address || "";
        }
      }
      const invoice = {
        ...buildInvoice("draft"),
        id: uid(),
        user_id: user?.id || "",
        created_at: new Date().toISOString(),
      } as any;
      const pdfBytes = await generateInvoicePDF(invoice, { name: companyName, address: companyAddress });
      const blob = new Blob([pdfBytes as unknown as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${form.invoiceNumber}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("PDF generation failed");
    }
    setDownloading(false);
  }, [form, items, subtotal, taxAmount, total]);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">New Invoice</h1>
          <p className="mt-1 text-sm text-gray-500">Fill in the details and generate your invoice</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            {downloading ? "Generating..." : "Download PDF"}
          </button>
          <button
            onClick={() => handleSave("draft")}
            disabled={saving}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Save Draft
          </button>
          <button
            onClick={() => handleSave("sent")}
            disabled={saving}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save & Send"}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-sm font-semibold text-gray-900">Invoice Details</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="mb-1 block text-xs text-gray-500">Invoice Number</label>
              <input
                type="text"
                value={form.invoiceNumber}
                onChange={(e) => setForm({ ...form, invoiceNumber: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-500">Issue Date</label>
              <input
                type="date"
                value={form.issueDate}
                onChange={(e) => setForm({ ...form, issueDate: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-500">Due Date</label>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="mb-1 block text-xs text-gray-500">Currency</label>
            <select
              value={form.currency}
              onChange={(e) => setForm({ ...form, currency: e.target.value })}
              className="w-48 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} ({c.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-sm font-semibold text-gray-900">Client Information</h2>
          {clients.length > 0 && (
            <div className="mb-4">
              <label className="mb-1 block text-xs text-gray-500">Select Existing Client</label>
              <select
                onChange={(e) => {
                  const c = clients.find((cl) => cl.id === e.target.value);
                  if (c) setForm({ ...form, clientName: c.name, clientEmail: c.email, clientAddress: c.address });
                }}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="">-- Choose a client or fill in below --</option>
                {clients.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
              </select>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs text-gray-500">Client Name</label>
              <input
                type="text"
                value={form.clientName}
                onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                placeholder="Acme Corp"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-500">Client Email</label>
              <input
                type="email"
                value={form.clientEmail}
                onChange={(e) => setForm({ ...form, clientEmail: e.target.value })}
                placeholder="billing@acme.com"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="mb-1 block text-xs text-gray-500">Client Address</label>
            <textarea
              value={form.clientAddress}
              onChange={(e) => setForm({ ...form, clientAddress: e.target.value })}
              placeholder={"123 Business St\nNew York, NY 10001\nUnited States"}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">Line Items</h2>
            <button onClick={addItem} className="text-sm font-medium text-blue-600 hover:text-blue-500">
              + Add Item
            </button>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-12 gap-3 text-xs text-gray-500">
              <div className="col-span-6">Description</div>
              <div className="col-span-2">Qty</div>
              <div className="col-span-2">Rate</div>
              <div className="col-span-1 text-right">Amount</div>
              <div className="col-span-1" />
            </div>
            {items.map((item) => (
              <div key={item.id} className="grid grid-cols-12 gap-3">
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => updateItem(item.id, "description", e.target.value)}
                  placeholder="Service or product"
                  className="col-span-6 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))}
                  min={1}
                  className="col-span-2 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
                <input
                  type="number"
                  value={item.rate}
                  onChange={(e) => updateItem(item.id, "rate", Number(e.target.value))}
                  min={0}
                  step={0.01}
                  className="col-span-2 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
                <div className="col-span-1 flex items-center justify-end text-sm font-medium text-gray-900">
                  {symbol}{(item.quantity * item.rate).toFixed(2)}
                </div>
                <div className="col-span-1 flex items-center justify-center">
                  {items.length > 1 && (
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-400 hover:text-red-600"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-gray-100 pt-4">
            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>{symbol}{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span className="flex items-center gap-2">
                    Tax
                    <input
                      type="number"
                      value={form.taxRate}
                      onChange={(e) => setForm({ ...form, taxRate: Number(e.target.value) })}
                      min={0}
                      max={100}
                      className="w-16 rounded border border-gray-300 px-2 py-1 text-xs text-right focus:border-blue-500 focus:outline-none"
                    />
                    %
                  </span>
                  <span>{symbol}{taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2 text-base font-bold text-gray-900">
                  <span>Total</span>
                  <span>{symbol}{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-sm font-semibold text-gray-900">Notes</h2>
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="Payment terms, thank you note, etc."
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
