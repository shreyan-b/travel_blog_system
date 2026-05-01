import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    blogId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    parentCommentId: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Comment", CommentSchema);
