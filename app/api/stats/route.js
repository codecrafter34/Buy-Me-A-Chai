import { NextResponse } from "next/server";
import connectDb from "@/db/connectDb";
import User from "@/models/User";
import Payment from "@/models/Payment";

export const GET = async () => {
    try {
        await connectDb();

        const totalUsers = await User.countDocuments({});
        
        const paymentStats = await Payment.aggregate([
            { $match: { done: true } },
            { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
        ]);

        const uniquePayers = await Payment.distinct("name", { done: true });
        const totalDonors = uniquePayers.length;

        const totalAmount = paymentStats.length > 0 ? paymentStats[0].totalAmount : 0;

        return NextResponse.json({ success: true, totalUsers, totalAmount, totalDonors });
    } catch (error) {
        console.error("Stats API error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
};
