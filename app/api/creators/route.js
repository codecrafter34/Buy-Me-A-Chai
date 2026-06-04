import { NextResponse } from "next/server";
import connectDb from "@/db/connectDb";
import User from "@/models/User";

export const GET = async (req) => {
    const query = req.nextUrl.searchParams.get("query") || "";
    if (!query.trim()) {
        return NextResponse.json({ success: true, creators: [] });
    }

    await connectDb();
    const regex = new RegExp(query, "i");
    const creators = await User.find(
        { role: "creator", $or: [{ username: regex }, { name: regex }] },
        { username: 1, name: 1, profilepic: 1 }
    )
        .sort({ updatedAt: -1 })
        .limit(10)
        .lean();

    return NextResponse.json({ success: true, creators: creators });
};
