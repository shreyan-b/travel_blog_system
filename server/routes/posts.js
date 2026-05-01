import express from "express";
import multer from "multer";
import path from "path";
import Post from "../models/Post.js";
import Like from "../models/Like.js";
import Comment from "../models/Comment.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// Multer setup for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Upload image route
router.post("/upload-image", verifyToken, upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    res.json({ imageUrl: `/uploads/${req.file.filename}` });
  } catch (error) {
    console.error("Image upload error:", error);
    res.status(500).json({ message: "Image upload failed." });
  }
});

// Create new post (status defaults to 'pending')
router.post("/", verifyToken, async (req, res) => {
  try {
    const { title, content, category, imageUrl } = req.body;
    const newPost = new Post({
      title,
      content,
      category,
      imageUrl,
      author: req.user.id,
      status: "pending",
    });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all approved posts with search, filter, sort, and pagination
router.get("/", async (req, res) => {
  try {
    const { category, page = 1, limit = 50, search, sort } = req.query;

    let filter = { status: "approved" };

    if (category && category !== "All") {
      filter.category = category;
    }

    // Search by keyword in title or content
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      filter.$or = [
        { title: searchRegex },
        { content: searchRegex },
      ];
    }

    // Determine sort order
    let sortOption = { createdAt: -1 }; // default: newest first
    if (sort === "oldest") {
      sortOption = { createdAt: 1 };
    }
    // "mostLiked" sorting handled after aggregation below

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    if (sort === "mostLiked") {
      // Use aggregation to sort by like count
      const pipeline = [
        { $match: filter },
        {
          $lookup: {
            from: "likes",
            localField: "_id",
            foreignField: "blogId",
            as: "likesArr",
          },
        },
        { $addFields: { likeCount: { $size: "$likesArr" } } },
        { $sort: { likeCount: -1, createdAt: -1 } },
        { $skip: (pageNum - 1) * limitNum },
        { $limit: limitNum },
        {
          $lookup: {
            from: "users",
            localField: "author",
            foreignField: "_id",
            as: "authorInfo",
          },
        },
        { $unwind: { path: "$authorInfo", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "comments",
            localField: "_id",
            foreignField: "blogId",
            as: "commentsArr",
          },
        },
        {
          $project: {
            title: 1,
            content: 1,
            category: 1,
            imageUrl: 1,
            status: 1,
            createdAt: 1,
            updatedAt: 1,
            likeCount: 1,
            commentCount: { $size: "$commentsArr" },
            author: {
              _id: "$authorInfo._id",
              username: "$authorInfo.username",
              email: "$authorInfo.email",
            },
          },
        },
      ];

      const posts = await Post.aggregate(pipeline);
      return res.json(posts);
    }

    // Standard query with like and comment counts
    const posts = await Post.find(filter)
      .populate("author", "username email")
      .sort(sortOption)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean();

    // Attach like and comment counts
    const postIds = posts.map((p) => p._id);
    const [likeCounts, commentCounts] = await Promise.all([
      Like.aggregate([
        { $match: { blogId: { $in: postIds } } },
        { $group: { _id: "$blogId", count: { $sum: 1 } } },
      ]),
      Comment.aggregate([
        { $match: { blogId: { $in: postIds } } },
        { $group: { _id: "$blogId", count: { $sum: 1 } } },
      ]),
    ]);

    const likeMap = {};
    likeCounts.forEach((l) => (likeMap[l._id.toString()] = l.count));
    const commentMap = {};
    commentCounts.forEach((c) => (commentMap[c._id.toString()] = c.count));

    const enrichedPosts = posts.map((p) => ({
      ...p,
      likeCount: likeMap[p._id.toString()] || 0,
      commentCount: commentMap[p._id.toString()] || 0,
    }));

    res.json(enrichedPosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get posts by the logged-in user (includes all statuses for their dashboard)
router.get("/my-posts", verifyToken, async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user.id })
      .populate("author", "username email")
      .sort({ createdAt: -1 })
      .lean();

    const postIds = posts.map((p) => p._id);
    const [likeCounts, commentCounts] = await Promise.all([
      Like.aggregate([
        { $match: { blogId: { $in: postIds } } },
        { $group: { _id: "$blogId", count: { $sum: 1 } } },
      ]),
      Comment.aggregate([
        { $match: { blogId: { $in: postIds } } },
        { $group: { _id: "$blogId", count: { $sum: 1 } } },
      ]),
    ]);

    const likeMap = {};
    likeCounts.forEach((l) => (likeMap[l._id.toString()] = l.count));
    const commentMap = {};
    commentCounts.forEach((c) => (commentMap[c._id.toString()] = c.count));

    const enrichedPosts = posts.map((p) => ({
      ...p,
      likeCount: likeMap[p._id.toString()] || 0,
      commentCount: commentMap[p._id.toString()] || 0,
    }));

    res.json(enrichedPosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get post by ID (populate full author info with _id included)
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("author").lean();
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Get like count and comment count
    const [likeCount, commentCount] = await Promise.all([
      Like.countDocuments({ blogId: post._id }),
      Comment.countDocuments({ blogId: post._id }),
    ]);

    res.json({ ...post, likeCount, commentCount });
  } catch (error) {
    console.error("Post get by id error:", error);
    res.status(500).json({ message: error.message });
  }
});

// Delete post (only author allowed)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    // First check if the post exists and belongs to the user
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // If we get here, user owns the post, so delete it
    await Post.findByIdAndDelete(req.params.id);
    // Also clean up likes and comments
    await Like.deleteMany({ blogId: req.params.id });
    await Comment.deleteMany({ blogId: req.params.id });
    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Server delete error:', error);
    return res.status(500).json({ success: false });
  }
});

// Update post (only author allowed)
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const { title, content, category, imageUrl } = req.body;

    // Only update provided fields
    if (title !== undefined) post.title = title;
    if (content !== undefined) post.content = content;
    if (category !== undefined) post.category = category;
    if (imageUrl !== undefined) post.imageUrl = imageUrl;

    // Reset status to pending when edited
    post.status = "pending";

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
