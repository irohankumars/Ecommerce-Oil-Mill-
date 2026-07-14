// Payment business logic for Razorpay-compatible flows.
import crypto from "crypto";
import { env } from "../config/env.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { createOrder as createStoreOrder } from "./orderService.js";
import { ApiError } from "../utils/ApiError.js";

async function calculateOrderAmount(productsPayload = []) {
  const productIds = productsPayload.map((item) => item.product);
  const products = await Product.find({ _id: { $in: productIds }, isActive: true });
  const productMap = new Map(products.map((product) => [product._id.toString(), product]));

  return productsPayload.reduce((total, item) => {
    const product = productMap.get(item.product.toString());
    if (!product) throw new ApiError("One or more products are unavailable.", 400);
    if (product.stock < item.quantity) throw new ApiError(`${product.title} does not have enough stock.`, 400);
    return total + (product.discountPrice || product.price) * item.quantity;
  }, 0);
}

export async function createPaymentOrder(payload) {
  const amountSource = payload.order?.products || payload.products;
  const calculatedAmount = amountSource?.length ? await calculateOrderAmount(amountSource) : 0;
  const amount = Math.round(calculatedAmount * 100);
  if (!amount || amount < 100) throw new ApiError("Valid order products are required.", 400);
  if (!env.razorpay.keyId || !env.razorpay.keySecret) {
    return { id: `order_local_${Date.now()}`, amount, currency: "INR", provider: "local", key: env.razorpay.keyId };
  }
  const auth = Buffer.from(`${env.razorpay.keyId}:${env.razorpay.keySecret}`).toString("base64");
  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
    body: JSON.stringify({ amount, currency: "INR", receipt: payload.receipt || `receipt_${Date.now()}` }),
  });
  if (!response.ok) throw new ApiError("Unable to create Razorpay order.", 502);
  const data = await response.json();
  return { ...data, key: env.razorpay.keyId };
}

export async function verifyPaymentAndCreateOrder(userId, payload) {
  if (payload.razorpayPaymentId) {
    const existing = await Order.findOne({ razorpayPaymentId: payload.razorpayPaymentId });
    if (existing) throw new ApiError("Payment has already been processed.", 409);
  }
  if (env.isProduction && (!payload.razorpayOrderId || !payload.razorpayPaymentId || !payload.razorpaySignature)) {
    throw new ApiError("Complete payment verification data is required.", 400);
  }
  if (payload.razorpayOrderId && payload.razorpayPaymentId && payload.razorpaySignature && env.razorpay.keySecret) {
    const expected = crypto.createHmac("sha256", env.razorpay.keySecret).update(`${payload.razorpayOrderId}|${payload.razorpayPaymentId}`).digest("hex");
    const received = Buffer.from(payload.razorpaySignature);
    const expectedBuffer = Buffer.from(expected);
    if (received.length !== expectedBuffer.length || !crypto.timingSafeEqual(expectedBuffer, received)) throw new ApiError("Payment verification failed.", 400);
  }
  const order = await createStoreOrder(userId, { ...payload.order, paymentMethod: "razorpay" });
  order.paymentStatus = "paid";
  order.razorpayOrderId = payload.razorpayOrderId;
  order.razorpayPaymentId = payload.razorpayPaymentId;
  order.razorpaySignature = payload.razorpaySignature;
  await order.save();
  return order;
}

export async function markOrderPayment(orderId, payload) {
  const order = await Order.findByIdAndUpdate(orderId, payload, { new: true, runValidators: true });
  if (!order) throw new ApiError("Order not found.", 404);
  return order;
}
