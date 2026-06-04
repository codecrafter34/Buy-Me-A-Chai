import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export const POST = async (req) => {
    let body;
    try {
        body = await req.json();
    } catch (error) {
        return NextResponse.json({ success: false, message: "Invalid JSON" }, { status: 400 });
    }

    const { amount } = body || {};
    if (!amount) {
        return NextResponse.json({ success: false, message: "Amount is required" }, { status: 400 });
    }

    const keyId = process.env.NEXT_PUBLIC_KEY_ID;
    const keySecret = process.env.KEY_SECRET;
    if (!keyId || !keySecret) {
        return NextResponse.json({ success: false, message: "Razorpay is not configured" }, { status: 500 });
    }

    const instance = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const order = await instance.orders.create({
        amount: Number.parseInt(amount, 10),
        currency: "INR",
    });

    return NextResponse.json({ success: true, orderId: order.id });
};
