import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const { priceId, userId, email } = await req.json();
  const plan = priceId === process.env.STRIPE_BUSINESS_PRICE_ID ? "business" : "pro";

  const session = await getStripe().checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: email || undefined,
    client_reference_id: userId || undefined,
    line_items: [{ price: priceId, quantity: 1 }],
    metadata: { plan },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
  });

  return NextResponse.json({ url: session.url });
}
