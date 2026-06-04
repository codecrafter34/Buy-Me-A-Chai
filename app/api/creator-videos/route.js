import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { authoptions } from "@/app/api/auth/[...nextauth]/route";
import connectDb from "@/db/connectDb";
import User from "@/models/User";
import Video from "@/models/Video";
import Purchase from "@/models/Purchase";

export const GET = async (req) => {
    const username = req.nextUrl.searchParams.get("username") || "";
    if (!username.trim()) {
        return NextResponse.json({ success: false, message: "Username is required" }, { status: 400 });
    }

    const session = await getServerSession(authoptions);
    let email = session?.user?.email;

    if (!email) {
        const token = await getToken({ req });
        email = token?.email;
    }

    await connectDb();
    const creator = await User.findOne({ username: username });
    if (!creator) {
        return NextResponse.json({ success: false, message: "Creator not found" }, { status: 404 });
    }

    const viewer = email ? await User.findOne({ email: email }) : null;
    const isOwner = viewer && creator._id.toString() === viewer._id.toString();

    const videos = await Video.find({ creatorId: creator._id }).sort({ createdAt: -1 }).lean();

    let unlockedIds = new Set();
    if (viewer && !isOwner) {
        const purchases = await Purchase.find({
            userId: viewer._id,
            videoId: { $in: videos.map((v) => v._id) },
        }).lean();
        unlockedIds = new Set(purchases.map((p) => p.videoId.toString()));
    }

    const response = videos.map((video) => {
        const unlocked = isOwner || unlockedIds.has(video._id.toString());
        return {
            _id: video._id,
            title: video.title,
            description: video.description,
            price: video.price,
            previewUrl: video.previewUrl,
            videoUrl: unlocked ? video.videoUrl : "",
            isUnlocked: unlocked,
            isOwner: Boolean(isOwner),
        };
    });

    return NextResponse.json({ success: true, videos: response });
};
