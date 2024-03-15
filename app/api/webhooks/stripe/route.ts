/* eslint-disable camelcase */
import Stripe from "stripe";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import { auth, unstable_update } from "@/auth";
import { createTransaction } from "@/lib/actions/transactions";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

async function handler(req: NextRequest) {
  const buf = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  if (!sig) {
    return NextResponse.json(
      { error: "Missing the stripe signature" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Webhook error:" + error },
      { status: 400 }
    );
  }

  console.log("✅ Success:", { event });

  switch (event.type) {
    case "checkout.session.completed":
      const { id, amount_total, metadata } = event.data.object;

      const transaction = {
        stripeId: id,
        amount: amount_total ? amount_total / 100 : 0,
        planId: Number(metadata?.planId) || 1,
        plan: metadata?.plan || "",
        credits: Number(metadata?.credits) || 0,
        buyerId: metadata?.buyerId || "",
        createdAt: new Date(),
      };

      const newTransaction = await createTransaction(transaction);

      // console.log({ charge });

      break;
    default:
      console.log("unhandled event type:" + event.type);
  }
  return NextResponse.json({ received: true });
}

export { handler as POST };

// export async function POST(request: Request) {
//   const body = await request.text();

//   const sig = request.headers.get("stripe-signature") as string;
//   const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

//   let event;

//   try {
//     event = Stripe.webhooks.constructEvent(body, sig, endpointSecret);
//   } catch (err) {
//     return NextResponse.json({ message: "Webhook error", error: err });
//   }

//   // Get the ID and type
//   const eventType = event.type;

//   // CREATE
//   if (eventType === "checkout.session.completed") {
//     const { id, amount_total, metadata } = event.data.object;

//     const transaction = {
//       stripeId: id,
//       amount: amount_total ? amount_total / 100 : 0,
//       plan: metadata?.plan || "",
//       credits: Number(metadata?.credits) || 0,
//       buyerId: metadata?.buyerId || "",
//       createdAt: new Date(),
//     };

//     const newTransaction = await createTransaction(transaction);

//     return NextResponse.json({ message: "OK", transaction: newTransaction });
//   }

//   return new Response("", { status: 200 });
// }
