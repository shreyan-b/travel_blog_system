import express from "express";
import Like from "../models/Like.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// Toggle like on a post (like or unlike)
router.post("/:blogId", verifyToken, async (req, res) => {
  try {
    const { blogId } = req.params;
    const userId = req.user.id;

    const existingLike = await Like.findOne({ userId, blogId });

    if (existingLike) {
      // Unlike
      await Like.deleteOne({ _id: existingLike._id });
      const likeCount = await Like.countDocuments({ blogId });
      return res.json({ liked: false, likeCount });
    } else {
      // Like
      await Like.create({ userId, blogId });
      const likeCount = await Like.countDocuments({ blogId });
      return res.json({ liked: true, likeCount });
    }
  } catch (error) {
    console.error("Like toggle error:", error);
    res.status(500).json({ message: error.message });
  }
});

// Check if user has liked a post
router.get("/:blogId/status", verifyToken, async (req, res) => {
  try {
    const { blogId } = req.params;
    const userId = req.user.id;

    const existingLike = await Like.findOne({ userId, blogId });
    const likeCount = await Like.countDocuments({ blogId });

    res.json({ liked: !!existingLike, likeCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get like count for a post (public)
router.get("/:blogId/count", async (req, res) => {
  try {
    const likeCount = await Like.countDocuments({ blogId: req.params.blogId });
    res.json({ likeCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
