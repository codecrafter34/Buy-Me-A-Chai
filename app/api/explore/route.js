import { NextResponse } from "next/server";
import connectDb from "@/db/connectDb";
import User from "@/models/User";
import Payment from "@/models/Payment"; // ensure models are registered

export const GET = async (req) => {
    try {
        await connectDb();

        const creators = await User.aggregate([
            { $match: { role: "creator" } },
            {
                $lookup: {
                    from: "payments", // Note: Ensure the collection name is 'payments'
                    localField: "username",
                    foreignField: "to_user",
                    as: "payments"
                }
            },
            {
                $addFields: {
                    totalRaised: {
                        $sum: {
                            $map: {
                                input: {
                                    $filter: {
                                        input: "$payments",
                                        as: "payment",
                                        cond: { $eq: ["$$payment.done", true] }
                                    }
                                },
                                as: "validPayment",
                                in: "$$validPayment.amount"
                            }
                        }
                    }
                }
            },
            { $sort: { totalRaised: -1 } },
            { $project: { passwordHash: 0, payments: 0 } }, 
            { $limit: 100 }
        ]);

        return NextResponse.json({ success: true, creators });
    } catch (error) {
        console.error("Explore API error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
};
