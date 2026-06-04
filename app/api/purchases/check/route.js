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

    const { videoIds } = body || {};
    if (!Array.isArray(videoIds)) {
        return NextResponse.json({ success: false, message: "videoIds must be an array" }, { status: 400 });
    }

    await connectDb();
    const user = await User.findOne({ email: email });
    if (!user) {
        return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const purchases = await Purchase.find({
        userId: user._id,
        videoId: { $in: videoIds },
    }).lean();

    const purchasedVideoIds = purchases.map((p) => p.videoId.toString());

    return NextResponse.json({ success: true, purchasedVideoIds: purchasedVideoIds });
};
