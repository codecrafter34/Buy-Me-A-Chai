"use server"
import Razorpay from "razorpay"
import Payment from "@/models/Payment"
import connectDb from "@/db/connectDb"
import User from "@/models/User"
import Video from "@/models/Video"


export const initiate = async (amount, to_username, paymentform) => {
    await connectDb()
    // fetch the secret of the user who is getting the payment 
    let user = await User.findOne({username: to_username})

    // const secret =

    var instance = new Razorpay({ key_id: process.env.NEXT_PUBLIC_KEY_ID, key_secret: process.env.KEY_SECRET })



    let options = {
        amount: Number.parseInt(amount),
        currency: "INR",
    }

    let x = await instance.orders.create(options)

    let paymentName = paymentform?.name?.trim() ? paymentform.name.trim() : "Anonymous";
    let paymentMessage = paymentform?.message?.trim() ? paymentform.message.trim() : "Keep up the good work!";

    // create a payment object which shows a pending payment in the database
    await Payment.create({ order_id: x.id, amount: amount/100, to_user: to_username, name: paymentName, message: paymentMessage })

    return x

}


export const fetchuser = async (username) => {
    await connectDb()
    let u = await User.findOne({ username: username })
    let user = u.toObject({ flattenObjectIds: true })
    return user
}

export const fetchpayments = async (username) => {
    await connectDb()
    // find all payments sorted by decreasing order of amount and flatten object ids
    let p = await Payment.find({ to_user: username, done:true }).sort({ amount: -1 }).limit(10).lean()
    return p
}

export const fetchCreatorStats = async (username) => {
    await connectDb()
    const payments = await Payment.find({ to_user: username, done: true }).lean()
    const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0)
    const uniquePayers = new Set(payments.map(p => p.name)).size
    return { totalAmount, uniquePayers }
}

export const fetchVideosByCreator = async (username) => {
    await connectDb()
    const user = await User.findOne({ username: username })
    if (!user) {
        return []
    }
    const videos = await Video.find({ creatorId: user._id }).sort({ createdAt: -1 }).lean()
    return videos
}

export const deleteVideo = async (videoId, username) => {
    await connectDb()
    const user = await User.findOne({ username: username })
    if (!user) {
        return { success: false, message: "User not found" }
    }
    const video = await Video.findOne({ _id: videoId, creatorId: user._id })
    if (!video) {
        return { success: false, message: "Video not found or unauthorized" }
    }
    await Video.deleteOne({ _id: videoId })
    return { success: true, message: "Video deleted successfully" }
}

export const setUserRole = async (username, role) => {
    await connectDb()
    if (!username) {
        return { success: false, message: "Username is required" }
    }
    if (role !== "user" && role !== "creator") {
        return { success: false, message: "Invalid role" }
    }

    const updatedUser = await User.findOneAndUpdate(
        { username: username },
        { role: role },
        { new: true }
    )

    if (!updatedUser) {
        return { success: false, message: "User not found" }
    }

    return { success: true, role: updatedUser.role }
}

// export const updateProfile = async (data, oldusername) => {
//     await connectDb()
//     let ndata = Object.fromEntries(data)

//     // If the username is being updated, check if username is available
//     if (oldusername !== ndata.username) {
//         let u = await User.findOne({ username: ndata.username })
//         if (u) {
//             return { error: "Username already exists" }
//         }   
//         await User.updateOne({email: ndata.email}, ndata)
//         // Now update all the usernames in the Payments table 
//         await Payment.updateMany({to_user: oldusername}, {to_user: ndata.username})
        
//     }
//     else{

        
//         await User.updateOne({email: ndata.email}, ndata)
//     }


// }
export const updateProfile = async (formData, username) => {
    await connectDb();

    // --- DEBUGGING STEP 1 ---
    // Check if the correct username and formData are reaching the server.
    console.log("Attempting to update profile for username:", username);
    const data = Object.fromEntries(formData);
    console.log("Received form data:", data);

    try {
        // Find the user by the username passed from the session
        const updatedUser = await User.findOneAndUpdate(
            { username: username }, // The condition to find the user
            { ...data, updatedAt: new Date() },
            { new: true }          // This option returns the updated document
        );

        // --- DEBUGGING STEP 2 ---
        if (updatedUser) {
            console.log("✅ Profile updated successfully:", updatedUser);
        } else {
            console.log("❌ ERROR: User not found with username:", username);
        }

        return { success: true, message: "Profile Updated" };
        
    } catch (error) {
        // --- DEBUGGING STEP 3 ---
        console.error("❌ DATABASE ERROR:", error);
        return { success: false, message: "Database update failed" };
    }
}
