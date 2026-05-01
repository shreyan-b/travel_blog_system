import express from "express";
import Post from "../models/Post.js";
import User from "../models/User.js";
import Like from "../models/Like.js";
import Comment from "../models/Comment.js";
import verifyAdmin from "../middleware/verifyAdmin.js";

const router = express.Router();

// All admin routes require admin role
router.use(verifyAdmin);

// ============ BLOG MODERATION ============

// Get all pending blogs
router.get("/posts/pending", async (req, res) => {
  try {
    const posts = await Post.find({ status: "pending" })
      .populate("author", "username email")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all approved blogs
router.get("/posts/approved", async (req, res) => {
  try {
    const posts = await Post.find({ status: "approved" })
      .populate("author", "username email")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Approve a blog post
router.put("/posts/:id/approve", async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    ).populate("author", "username email");
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Reject a blog post
router.put("/posts/:id/reject", async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    ).populate("author", "username email");
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin delete any blog post
router.delete("/posts/:id", async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    // Clean up likes and comments
    await Like.deleteMany({ blogId: req.params.id });
    await Comment.deleteMany({ blogId: req.params.id });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============ USER MANAGEMENT ============

// Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Suspend a user
router.put("/users/:id/suspend", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isSuspended: true },
      { new: true }
    ).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Unsuspend a user
router.put("/users/:id/unsuspend", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isSuspended: false },
      { new: true }
    ).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a user and all their content
router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Delete all posts, likes, and comments by this user
    const userPosts = await Post.find({ author: req.params.id });
    const postIds = userPosts.map((p) => p._id);

    await Post.deleteMany({ author: req.params.id });
    await Like.deleteMany({ $or: [{ userId: req.params.id }, { blogId: { $in: postIds } }] });
    await Comment.deleteMany({ $or: [{ userId: req.params.id }, { blogId: { $in: postIds } }] });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============ DASHBOARD STATS ============

router.get("/stats", async (req, res) => {
  try {
    const [totalUsers, totalPosts, pendingPosts, approvedPosts, totalLikes, totalComments] =
      await Promise.all([
        User.countDocuments(),
        Post.countDocuments(),
        Post.countDocuments({ status: "pending" }),
        Post.countDocuments({ status: "approved" }),
        Like.countDocuments(),
        Comment.countDocuments(),
      ]);

    res.json({ totalUsers, totalPosts, pendingPosts, approvedPosts, totalLikes, totalComments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
