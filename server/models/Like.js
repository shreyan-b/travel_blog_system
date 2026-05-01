import mongoose from "mongoose";

const LikeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    blogId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  },
  { timestamps: true }
);

// Unique compound index: one like per user per post
LikeSchema.index({ userId: 1, blogId: 1 }, { unique: true });

export default mongoose.model("Like", LikeSchema);
