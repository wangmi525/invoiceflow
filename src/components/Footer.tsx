import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-4 gap-8">
          <div>
            <h3 className="mb-3 text-lg font-bold text-blue-900">InvoiceFlow</h3>
            <p className="text-sm text-gray-500">Professional invoices. Online payments. Zero hassle.</p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-gray-900">Product</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/#features" className="hover:text-gray-900">Features</Link></li>
              <li><Link href="/pricing" className="hover:text-gray-900">Pricing</Link></li>
              <li><Link href="/#how-it-works" className="hover:text-gray-900">How It Works</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-gray-900">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/privacy" className="hover:text-gray-900">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-gray-900">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-gray-900">Support</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="mailto:support@invoiceflow.app" className="hover:text-gray-900">Contact Us</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-6 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} InvoiceFlow. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
