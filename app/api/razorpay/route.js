// app/api/razorpay/route.js

import { NextResponse } from "next/server";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils";
import Payment from "@/models/Payment";
import connectDb from "@/db/connectDb";

export const POST = async (req) => {
    await connectDb();
    let body;
    try {
        body = await req.json();
    } catch (error) {
        return NextResponse.json({ success: false, message: "Invalid JSON body" }, { status: 400 });
    }

    // Find the payment document
    let p = await Payment.findOne({ order_id: body.razorpay_order_id });
    if (!p) {
        return NextResponse.json({ success: false, message: "Order Id not found" }, { status: 404 });
    }

    // ⭐️ Best Practice: Idempotency Check
    // If payment is already marked as done, just return success without re-processing.
    if (p.done) {
        return NextResponse.json({ success: true, message: "Payment has already been verified" });
    }

    // Verify the payment signature
    const secret = process.env.KEY_SECRET;
    if (!secret) {
        console.error("Razorpay secret key is not set in environment variables.");
        return NextResponse.json({ success: false, message: "Server configuration error" }, { status: 500 });
    }

    try {
        // This function throws an error on failure and returns undefined on success.
        validatePaymentVerification(
            {
                order_id: body.razorpay_order_id,
                payment_id: body.razorpay_payment_id,
            },
            body.razorpay_signature,
            secret
        );

        // If code execution reaches here, verification is successful.
        const updatedPayment = await Payment.findOneAndUpdate(
            { order_id: body.razorpay_order_id },
            { done: true, razorpay_payment_id: body.razorpay_payment_id, razorpay_signature: body.razorpay_signature },
            { new: true }
        );

        return NextResponse.json({ success: true, message: "Payment Verified", order: updatedPayment });

    } catch (error) {
        // If the signature is not valid, an error will be thrown.
        return NextResponse.json({ success: false, message: "Payment Verification Failed" });
    }
};