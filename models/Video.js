import mongoose from "mongoose";

const { Schema, model } = mongoose;

const VideoSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    videoUrl: { type: String, required: true },
    previewUrl: { type: String },
    creatorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Video || model("Video", VideoSchema);
