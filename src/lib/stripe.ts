import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia' as any,
});

export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    invoiceLimit: 5,
    features: ['5 invoices/month', 'PDF download', 'Basic templates', '3 currencies'],
  },
  pro: {
    name: 'Pro',
    price: 12,
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID || '',
    invoiceLimit: -1,
    features: ['Unlimited invoices', 'Custom logo', 'All currencies', 'Client management', 'Payment tracking', 'No watermark'],
  },
  business: {
    name: 'Business',
    price: 29,
    stripePriceId: process.env.STRIPE_BUSINESS_PRICE_ID || '',
    invoiceLimit: -1,
    features: ['Everything in Pro', 'Team access (5 seats)', 'API access', 'Priority support', 'Custom invoice fields', 'Export reports'],
  },
} as const;
