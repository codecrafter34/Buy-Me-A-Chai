import mongoose from "mongoose";

const { Schema, model } = mongoose;

const PurchaseSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    videoId: { type: Schema.Types.ObjectId, ref: "Video", required: true },
    paymentId: { type: String },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Purchase || model("Purchase", PurchaseSchema);
