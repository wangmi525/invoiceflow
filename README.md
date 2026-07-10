# InvoiceFlow

Professional invoice management SaaS for freelancers and small businesses. Create, send, and track invoices with Stripe payment integration.

**Live Demo:** [invoiceflow-plum.vercel.app](https://invoiceflow-plum.vercel.app)

## Features

- **Invoice Creation** — Professional invoices with customizable templates
- **Client Management** — Store and manage client information
- **Multi-Currency** — Support for 12+ currencies (USD, EUR, GBP, CNY, JPY, etc.)
- **PDF Generation** — Download invoices as PDF files
- **Payment Tracking** — Track invoice status (draft, sent, paid, overdue)
- **Stripe Integration** — Accept payments via Stripe
- **Google Login** — Sign in with Google OAuth
- **Free Plan** — 5 invoices/month for free users
- **Pro Plan** — $12/month for unlimited invoices
- **Business Plan** — $29/month for unlimited invoices + priority support

## Tech Stack

- **Frontend:** Next.js 15, React 19, Tailwind CSS 4
- **Backend:** Next.js API Routes
- **Database:** Supabase (PostgreSQL + Auth)
- **Payments:** Stripe (Subscriptions)
- **PDF:** pdf-lib (client-side generation)
- **Deployment:** Vercel

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/wangmi525/invoiceflow.git
cd invoiceflow
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy `.env.example` to `.env.local` and fill in your keys:

```bash
cp .env.example .env.local
```

Required keys:

- `NEXT_PUBLIC_SUPABASE_URL` — Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key (Settings → API)
- `STRIPE_SECRET_KEY` — Stripe secret key (dashboard.stripe.com)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — Stripe publishable key
- `STRIPE_WEBHOOK_SECRET` — Stripe webhook signing secret
- `STRIPE_PRO_PRICE_ID` — Stripe price ID for Pro plan ($12/mo)
- `STRIPE_BUSINESS_PRICE_ID` — Stripe price ID for Business plan ($29/mo)
- `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID` — Same as STRIPE_PRO_PRICE_ID (public)
- `NEXT_PUBLIC_STRIPE_BUSINESS_PRICE_ID` — Same as STRIPE_BUSINESS_PRICE_ID (public)
- `NEXT_PUBLIC_APP_URL` — Your app URL (e.g., `https://invoiceflow-plum.vercel.app`)

### 4. Set up Supabase database

Go to Supabase Dashboard → SQL Editor, run the contents of `supabase-schema.sql`.

### 5. Set up Stripe

1. Create products in Stripe Dashboard:
   - **InvoiceFlow Pro** — $12/month
   - **InvoiceFlow Business** — $29/month
2. Create a webhook endpoint:
   - URL: `https://your-domain.com/api/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.deleted`
3. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

### 6. Set up Google OAuth (optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials (Web application)
3. Add authorized redirect URI: `https://your-supabase-project.supabase.co/auth/v1/callback`
4. Enable Google provider in Supabase Dashboard → Authentication → Providers → Google
5. Add Client ID and Client Secret

### 7. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Pricing

| Plan | Price | Features |
|------|-------|----------|
| Free | $0 | 5 invoices/month, basic features |
| Pro | $12/mo | Unlimited invoices, all currencies, PDF download |
| Business | $29/mo | Everything in Pro + priority support |

## Deployment

Push to GitHub and connect to Vercel for automatic deployments:

```bash
git push origin main
```

Vercel will auto-detect Next.js and deploy.

## License

MIT
