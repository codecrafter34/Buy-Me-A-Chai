import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDb from "@/db/connectDb";
import User from "@/models/User";

export const POST = async (req) => {
    let body;
    try {
        body = await req.json();
    } catch (error) {
        return NextResponse.json({ success: false, message: "Invalid JSON" }, { status: 400 });
    }

    const { email, username, password, role, name } = body || {};
    if (!email || !username || !password) {
        return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const cleanRole = role === "creator" ? "creator" : "user";

    await connectDb();
    const existingEmail = await User.findOne({ email: email });
    if (existingEmail) {
        return NextResponse.json({ success: false, message: "Email already exists" }, { status: 400 });
    }

    const existingUsername = await User.findOne({ username: username });
    if (existingUsername) {
        return NextResponse.json({ success: false, message: "Username already exists" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
        email: email,
        username: username,
        name: name || username,
        role: cleanRole,
        passwordHash: passwordHash,
    });

    return NextResponse.json({ success: true, userId: user._id });
};
