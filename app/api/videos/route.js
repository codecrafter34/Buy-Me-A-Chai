import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { authoptions } from "@/app/api/auth/[...nextauth]/route";
import connectDb from "@/db/connectDb";
import User from "@/models/User";
import Video from "@/models/Video";

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

    const { title, description, price, videoUrl, previewUrl } = body || {};
    if (!title || !price || !videoUrl) {
        return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    await connectDb();
    const user = await User.findOne({ email: email });
    if (!user) {
        return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const video = await Video.create({
        title: title,
        description: description || "",
        price: Number(price),
        videoUrl: videoUrl,
        previewUrl: previewUrl || "",
        creatorId: user._id,
        updatedAt: new Date(),
    });

    return NextResponse.json({ success: true, video: video });
};
