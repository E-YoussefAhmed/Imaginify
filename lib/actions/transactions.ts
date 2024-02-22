"use server";

import Stripe from "stripe";
import { redirect } from "next/navigation";

import Transaction from "@/lib/models/transaction.model";
import { handleError } from "@/lib/utils";
import { connectToDatabase } from "@/lib/db/mongoose";
import { updateCredits } from "@/lib/data/user";

export const checkoutCredits = async (
  transaction: CheckoutTransactionParams
) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  // Stripe make transactions in cents
  const amount = Number(transaction.amount) * 100;

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: amount,
          product_data: {
            name: transaction.plan,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      plan: transaction.plan,
      credits: transaction.credits,
      buyerId: transaction.buyerId,
    },
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/profile`,
    cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/`,
  });

  redirect(session.url!);
};

export const createTransaction = async (
  transaction: CreateTransactionParams
) => {
  try {
    await connectToDatabase();

    const newTransaction = await Transaction.create({
      ...transaction,
      buyer: transaction.buyerId,
    });

    await updateCredits(newTransaction.buyerId, transaction.credits);

    return JSON.parse(JSON.stringify(newTransaction));
  } catch (error) {
    handleError(error);
  }
};
