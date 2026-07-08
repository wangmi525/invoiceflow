export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
      <p className="mt-2 text-sm text-gray-400">Last updated: July 2026</p>
      <div className="prose prose-gray mt-8 space-y-6 text-sm leading-relaxed text-gray-600">
        <h2 className="text-xl font-semibold text-gray-900">1. Information We Collect</h2>
        <p>
          When you use InvoiceFlow, we collect information you provide directly: your name, email address,
          company information, and invoice data. We also collect usage data such as pages visited and
          features used.
        </p>

        <h2 className="text-xl font-semibold text-gray-900">2. How We Use Your Information</h2>
        <p>
          We use your information to provide and improve our services, process payments through Stripe,
          send important account notifications, and comply with legal obligations.
        </p>

        <h2 className="text-xl font-semibold text-gray-900">3. Data Security</h2>
        <p>
          Your invoice PDFs are generated locally in your browser and are not uploaded to our servers.
          Payment processing is handled entirely by Stripe, a PCI-DSS Level 1 certified payment processor.
        </p>

        <h2 className="text-xl font-semibold text-gray-900">4. Third-Party Services</h2>
        <p>
          We use Stripe for payment processing and Supabase for data storage. Both services have their own
          privacy policies governing the use of your data.
        </p>

        <h2 className="text-xl font-semibold text-gray-900">5. Your Rights</h2>
        <p>
          You can request access to, correction of, or deletion of your personal data at any time by
          contacting us at support@invoiceflow.app.
        </p>

        <h2 className="text-xl font-semibold text-gray-900">6. Contact</h2>
        <p>
          For questions about this privacy policy, contact us at support@invoiceflow.app.
        </p>
      </div>
    </main>
  );
}
