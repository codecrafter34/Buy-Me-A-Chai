import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { authoptions } from "@/app/api/auth/[...nextauth]/route";

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

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !uploadPreset) {
        return NextResponse.json({ success: false, message: "Cloudinary is not configured" }, { status: 500 });
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
        return NextResponse.json({ success: false, message: "Missing file" }, { status: 400 });
    }

    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("upload_preset", uploadPreset);
    uploadData.append("folder", "get-me-a-chai/videos");

    const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
        {
            method: "POST",
            body: uploadData,
        }
    );

    const uploadJson = await uploadRes.json();
    if (!uploadRes.ok) {
        return NextResponse.json(
            { success: false, message: "Cloudinary upload failed", error: uploadJson },
            { status: 502 }
        );
    }

    return NextResponse.json({
        success: true,
        videoUrl: uploadJson.secure_url,
        streamingUrl: uploadJson.secure_url,
    });
};
