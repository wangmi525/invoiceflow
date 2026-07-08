import Link from "next/link";

const FEATURES = [
  {
    icon: "📄",
    title: "PDF Invoice Generator",
    desc: "Create professional PDF invoices in seconds. Fill in the blanks, download instantly. No design skills needed.",
  },
  {
    icon: "💳",
    title: "Online Payments",
    desc: "Embed Stripe and PayPal payment links directly in your invoices. Get paid faster.",
  },
  {
    icon: "🌍",
    title: "12+ Currencies",
    desc: "USD, EUR, GBP, JPY, and more. Serve clients worldwide without conversion headaches.",
  },
  {
    icon: "👤",
    title: "Client Management",
    desc: "Save clients, reuse info for new invoices. Never type the same details twice.",
  },
  {
    icon: "🔒",
    title: "Privacy First",
    desc: "PDFs generated in your browser. Your data stays yours. No server upload.",
  },
  {
    icon: "📊",
    title: "Payment Tracking",
    desc: "See which invoices are draft, sent, paid, or overdue. Stay on top of your cash flow.",
  },
];

const STEPS = [
  { num: "1", title: "Fill in invoice details", desc: "Add your info, client info, line items, and tax rate." },
  { num: "2", title: "Generate & download PDF", desc: "One click to create a professional invoice PDF." },
  { num: "3", title: "Send payment link", desc: "Client clicks the link and pays via Stripe or PayPal." },
];

export default function Home() {
  return (
    <main className="flex-1">
      <section className="mx-auto max-w-7xl px-6 py-24 text-center">
        <h1 className="mx-auto max-w-4xl text-5xl font-bold leading-tight tracking-tight text-gray-900">
          Professional Invoices.
          <br />
          <span className="text-blue-600">Online Payments.</span>
          <br />
          Zero Hassle.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-500">
          Create beautiful invoices in seconds. Get paid online via Stripe and PayPal.
          Trusted by freelancers and businesses worldwide.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="/auth?tab=signup"
            className="rounded-lg bg-blue-600 px-8 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-500"
          >
            Start Free — No Credit Card
          </Link>
          <Link
            href="/#features"
            className="rounded-lg border border-gray-300 px-8 py-3 text-base font-semibold text-gray-700 hover:bg-gray-50"
          >
            See Features
          </Link>
        </div>
      </section>

      <section id="features" className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center text-3xl font-bold text-gray-900">Everything You Need</h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-gray-500">
            One tool to create invoices, collect payments, and manage clients.
          </p>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="text-3xl">{f.icon}</div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{f.title}</h3>
                <p className="mt-2 text-sm text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center text-3xl font-bold text-gray-900">How It Works</h2>
          <div className="mt-16 grid gap-12 md:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.num} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
                  {s.num}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{s.title}</h3>
                <p className="mt-2 text-sm text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-blue-900 py-24 text-center text-white">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-3xl font-bold">Stop Sending Ugly Invoices</h2>
          <p className="mt-4 text-blue-200">
            Join thousands of freelancers and businesses who get paid faster with InvoiceFlow.
          </p>
          <Link
            href="/auth?tab=signup"
            className="mt-8 inline-block rounded-lg bg-white px-8 py-3 text-base font-semibold text-blue-900 shadow-sm hover:bg-blue-50"
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </main>
  );
}
