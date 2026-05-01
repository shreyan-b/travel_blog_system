import express from "express";
import Comment from "../models/Comment.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// Get all comments for a blog post (with replies nested)
router.get("/:blogId", async (req, res) => {
  try {
    const { blogId } = req.params;

    // Fetch all comments for this blog
    const comments = await Comment.find({ blogId })
      .populate("userId", "username email")
      .sort({ createdAt: 1 })
      .lean();

    // Separate top-level comments and replies
    const topLevel = [];
    const repliesMap = {};

    comments.forEach((c) => {
      if (!c.parentCommentId) {
        c.replies = [];
        topLevel.push(c);
      } else {
        const parentId = c.parentCommentId.toString();
        if (!repliesMap[parentId]) repliesMap[parentId] = [];
        repliesMap[parentId].push(c);
      }
    });

    // Attach replies to their parent
    topLevel.forEach((c) => {
      c.replies = repliesMap[c._id.toString()] || [];
    });

    res.json(topLevel);
  } catch (error) {
    console.error("Get comments error:", error);
    res.status(500).json({ message: error.message });
  }
});

// Add a comment (top-level or reply)
router.post("/:blogId", verifyToken, async (req, res) => {
  try {
    const { blogId } = req.params;
    const { content, parentCommentId } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Comment content is required" });
    }

    const newComment = await Comment.create({
      userId: req.user.id,
      blogId,
      content: content.trim(),
      parentCommentId: parentCommentId || null,
    });

    // Populate user info for immediate return
    const populated = await Comment.findById(newComment._id)
      .populate("userId", "username email")
      .lean();

    res.status(201).json(populated);
  } catch (error) {
    console.error("Add comment error:", error);
    res.status(500).json({ message: error.message });
  }
});

// Delete a comment (only the commenter can delete)
router.delete("/:commentId", verifyToken, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Delete the comment and all its replies
    await Comment.deleteMany({
      $or: [
        { _id: comment._id },
        { parentCommentId: comment._id },
      ],
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
