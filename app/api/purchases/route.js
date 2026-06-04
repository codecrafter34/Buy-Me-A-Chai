import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { authoptions } from "@/app/api/auth/[...nextauth]/route";
import connectDb from "@/db/connectDb";
import User from "@/models/User";
import Purchase from "@/models/Purchase";

export const POST = async (req) => {
    const session = await getServerSession(authoptions);
    let email = session?.user?.email;

    if (!email) {
        const token = await getToken({ req });
        email = token?.email;
    }

    if (!email) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    let body;
    try {
        body = await req.json();
    } catch (error) {
        return NextResponse.json({ success: false, message: "Invalid JSON" }, { status: 400 });
    }

    const { videoId, paymentId } = body || {};
    if (!videoId) {
        return NextResponse.json({ success: false, message: "Missing videoId" }, { status: 400 });
    }

    await connectDb();
    const user = await User.findOne({ email: email });
    if (!user) {
        return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const existing = await Purchase.findOne({ userId: user._id, videoId: videoId });
    if (existing) {
        return NextResponse.json({ success: true, purchase: existing });
    }

    const purchase = await Purchase.create({
        userId: user._id,
        videoId: videoId,
        paymentId: paymentId || "",
    });

    return NextResponse.json({ success: true, purchase: purchase });
};
