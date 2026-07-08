import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;
  const supabase = createServiceClient();

  let event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    const userId = session.client_reference_id;
    const customerId = session.customer;

    if (userId) {
      await supabase
        .from("user_profiles")
        .update({ plan: "pro", stripe_customer_id: customerId })
        .eq("user_id", userId);
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as any;
    const customerId = subscription.customer;

    const { data } = await supabase
      .from("user_profiles")
      .select("user_id")
      .eq("stripe_customer_id", customerId)
      .single();

    if (data) {
      await supabase
        .from("user_profiles")
        .update({ plan: "free", stripe_customer_id: "" })
        .eq("user_id", data.user_id);
    }
  }

  return NextResponse.json({ received: true });
}
