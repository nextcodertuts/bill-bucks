/* eslint-disable @typescript-eslint/no-require-imports */

import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export const createPaymentOrder = async () => {
  try {
    const amount = 99 * 100; // ₹9.99 in paise
    const currency = "INR";

    const options = {
      amount,
      currency,
      receipt: `rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    return { orderId: order.id, amount, currency };
  } catch (error) {
    console.error("Error creating payment order:", error);
    throw error;
  }
};

export const verifyPayment = async (
  orderId: string,
  paymentId: string,
  signature: string
) => {
  const text = orderId + "|" + paymentId;
  const crypto = require("crypto");
  const generated_signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(text)
    .digest("hex");

  if (generated_signature === signature) {
    return true;
  }
  return false;
};
