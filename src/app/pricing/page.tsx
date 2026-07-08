"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase/client";

const PLANS = [
  {
    name: "Free",
    price: 0,
    period: "",
    desc: "Try before you buy",
    features: ["5 invoices/month", "PDF download", "Basic templates", "3 currencies"],
    priceId: null,
    highlighted: false,
  },
  {
    name: "Pro",
    price: 12,
    period: "/month",
    desc: "For serious freelancers",
    features: [
      "Unlimited invoices",
      "Custom logo",
      "12+ currencies",
      "Client management",
      "Payment tracking",
      "No watermark",
    ],
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || "",
    highlighted: true,
  },
  {
    name: "Business",
    price: 29,
    period: "/month",
    desc: "For teams & agencies",
    features: [
      "Everything in Pro",
      "Team access (5 seats)",
      "API access",
      "Priority support",
      "Custom fields",
      "Export reports",
    ],
    priceId: process.env.NEXT_PUBLIC_STRIPE_BUSINESS_PRICE_ID || "",
    highlighted: false,
  },
];

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (plan: typeof PLANS[0]) => {
    if (!plan.priceId) {
      window.location.href = "/auth?tab=signup";
      return;
    }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = "/auth?tab=signup";
      return;
    }
    setLoading(plan.name);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId: plan.priceId, userId: user.id, email: user.email }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
    setLoading(null);
  };

  return (
    <main className="flex flex-1">
      <Navbar />
      <div className="mx-auto max-w-7xl px-6 py-24">
        <h1 className="text-center text-4xl font-bold text-gray-900">Simple, Transparent Pricing</h1>
        <p className="mx-auto mt-4 max-w-xl text-center text-gray-500">
          Start free. Upgrade when you need more. No hidden fees.
        </p>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl border p-8 ${
                plan.highlighted
                  ? "border-blue-600 bg-blue-50 shadow-lg"
                  : "border-gray-200 bg-white"
              }`}
            >
              <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
              <p className="mt-1 text-sm text-gray-500">{plan.desc}</p>
              <div className="mt-6">
                <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                <span className="text-gray-500">{plan.period}</span>
              </div>
              <ul className="mt-8 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleCheckout(plan)}
                disabled={loading === plan.name}
                className={`mt-8 block w-full rounded-lg py-3 text-center text-sm font-semibold ${
                  plan.highlighted
                    ? "bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {loading === plan.name ? "Redirecting..." : plan.price === 0 ? "Start Free" : `Start ${plan.name}`}
              </button>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}
