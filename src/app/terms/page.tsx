export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
      <p className="mt-2 text-sm text-gray-400">Last updated: July 2026</p>
      <div className="prose prose-gray mt-8 space-y-6 text-sm leading-relaxed text-gray-600">
        <h2 className="text-xl font-semibold text-gray-900">1. Acceptance of Terms</h2>
        <p>
          By accessing or using InvoiceFlow, you agree to be bound by these Terms of Service.
          If you do not agree, do not use the service.
        </p>

        <h2 className="text-xl font-semibold text-gray-900">2. Description of Service</h2>
        <p>
          InvoiceFlow provides an online tool for creating invoices and generating payment links.
          We are not a financial institution, accounting service, or tax advisor.
        </p>

        <h2 className="text-xl font-semibold text-gray-900">3. User Responsibilities</h2>
        <p>
          You are solely responsible for the accuracy and legality of the content of invoices
          created using InvoiceFlow. InvoiceFlow does not provide legal, tax, or accounting advice.
        </p>

        <h2 className="text-xl font-semibold text-gray-900">4. Subscriptions and Payments</h2>
        <p>
          Paid subscriptions are billed through Stripe. You may cancel at any time. Refunds
          are provided on a case-by-case basis within 14 days of purchase.
        </p>

        <h2 className="text-xl font-semibold text-gray-900">5. Limitation of Liability</h2>
        <p>
          InvoiceFlow is provided &quot;as is&quot; without warranties. We are not liable for any
          damages arising from the use of our service.
        </p>

        <h2 className="text-xl font-semibold text-gray-900">6. Contact</h2>
        <p>
          For questions about these terms, contact us at support@invoiceflow.app.
        </p>
      </div>
    </main>
  );
}
