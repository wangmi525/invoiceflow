"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

interface Customer {
  id: string;
  name: string;
  email: string;
  address: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: "", email: "", address: "" });

  async function fetchCustomers() {
    const { data } = await supabase().from("customers").select("*").order("created_at", { ascending: false });
    if (data) setCustomers(data);
    setLoading(false);
  }

  useEffect(() => { fetchCustomers(); }, []);

  const handleSave = async () => {
    if (!newCustomer.name) return;
    await supabase().from("customers").insert(newCustomer);
    setNewCustomer({ name: "", email: "", address: "" });
    setShowForm(false);
    fetchCustomers();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this client?")) return;
    await supabase().from("customers").delete().eq("id", id);
    fetchCustomers();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your client directory</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500"
        >
          + Add Client
        </button>
      </div>

      {showForm && (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">New Client</h3>
          <div className="grid grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Client Name"
              value={newCustomer.name}
              onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
            <input
              type="email"
              placeholder="Email"
              value={newCustomer.email}
              onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Address"
              value={newCustomer.address}
              onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div className="mt-4 flex gap-3">
            <button onClick={() => setShowForm(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
            <button onClick={handleSave} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500">Save Client</button>
          </div>
        </div>
      )}

      <div className="mt-8 rounded-xl border border-gray-200 bg-white">
        {loading ? (
          <div className="px-6 py-12 text-center text-sm text-gray-400">Loading...</div>
        ) : customers.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-gray-400">No clients yet. Add your first client above.</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs text-gray-500">
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Address</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{c.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{c.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{c.address}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDelete(c.id)} className="text-xs text-red-500 hover:text-red-700">Delete</button>
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
