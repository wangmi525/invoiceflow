"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

export default function SettingsPage() {
  const [company, setCompany] = useState({
    name: "",
    address: "",
    email: "",
    phone: "",
    website: "",
    taxId: "",
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase().auth.getUser();
      if (!user) return;
      const { data } = await supabase().from("user_profiles").select("*").eq("user_id", user.id).single();
      if (data) {
        setCompany({
          name: data.company_name || "",
          address: data.company_address || "",
          email: data.company_email || "",
          phone: data.company_phone || "",
          website: data.company_website || "",
          taxId: data.tax_id || "",
        });
      }
    }
    load();
  }, []);

  const handleSave = async () => {
    const { data: { user } } = await supabase().auth.getUser();
    if (!user) return;
    await supabase().from("user_profiles").upsert({
      user_id: user.id,
      company_name: company.name,
      company_address: company.address,
      company_email: company.email,
      company_phone: company.phone,
      company_website: company.website,
      tax_id: company.taxId,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      <p className="mt-1 text-sm text-gray-500">Configure your company details for invoices</p>

      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-sm font-semibold text-gray-900">Company Information</h2>
        <p className="mb-4 text-xs text-gray-400">This information will appear on your invoices</p>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs text-gray-500">Company Name</label>
              <input
                type="text"
                value={company.name}
                onChange={(e) => setCompany({ ...company, name: e.target.value })}
                placeholder="Your Company LLC"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-500">Email</label>
              <input
                type="email"
                value={company.email}
                onChange={(e) => setCompany({ ...company, email: e.target.value })}
                placeholder="billing@company.com"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-500">Address</label>
            <textarea
              value={company.address}
              onChange={(e) => setCompany({ ...company, address: e.target.value })}
              placeholder={"123 Business St\nCity, State 12345\nCountry"}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="mb-1 block text-xs text-gray-500">Phone</label>
              <input
                type="tel"
                value={company.phone}
                onChange={(e) => setCompany({ ...company, phone: e.target.value })}
                placeholder="+1 234 567 890"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-500">Website</label>
              <input
                type="url"
                value={company.website}
                onChange={(e) => setCompany({ ...company, website: e.target.value })}
                placeholder="https://company.com"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-500">Tax ID / VAT</label>
              <input
                type="text"
                value={company.taxId}
                onChange={(e) => setCompany({ ...company, taxId: e.target.value })}
                placeholder="US123456789"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
          <button onClick={handleSave} className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500">
            {saved ? "Saved!" : "Save Settings"}
          </button>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-sm font-semibold text-gray-900">Your Plan</h2>
        <div className="flex items-center justify-between">
          <div>
            <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">Free Plan</span>
            <p className="mt-2 text-sm text-gray-500">5 invoices/month · Basic templates · 3 currencies</p>
          </div>
          <a href="/pricing" className="rounded-lg border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50">
            Upgrade to Pro
          </a>
        </div>
      </div>
    </div>
  );
}
