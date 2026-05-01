import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API, getImageUrl } from "../service/api";
import {
  Typography,
  Box,
  Button,
  TextField,
  IconButton,
  Chip,
  Divider,
  Avatar,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ReplyIcon from "@mui/icons-material/Reply";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { AuthContext } from "../context/AuthContext";

const PostDetail = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // Like state
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likeLoading, setLikeLoading] = useState(false);

  // Comment state
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await API.getPostById(id);
        setPost(data);
        setLikeCount(data.likeCount || 0);
        console.log("Fetched post:", data);
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  // Fetch like status
  useEffect(() => {
    const fetchLikeStatus = async () => {
      if (user?.token) {
        try {
          const data = await API.getLikeStatus(id, user.token);
          setLiked(data.liked);
          setLikeCount(data.likeCount);
        } catch (error) {
          console.error("Error fetching like status:", error);
        }
      }
    };
    fetchLikeStatus();
  }, [id, user]);

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await API.getComments(id);
        setComments(data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    fetchComments();
  }, [id]);

  // Log user for debugging
  console.log("Logged-in user:", user);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        const response = await API.deletePost(id, user.token);
        // If successful, go to home page
        navigate("/home", { replace: true });
      } catch (error) {
        // Stay on the page and show error in console
        console.error("Delete error:", {
          error,
          status: error.response?.status,
          data: error.response?.data,
        });
      }
    }
  };

  const handleEdit = () => {
    navigate(`/edit-post/${id}`);
  };

  // Like toggle handler
  const handleLikeToggle = async () => {
    if (!user?.token || likeLoading) return;
    setLikeLoading(true);
    try {
      const data = await API.toggleLike(id, user.token);
      setLiked(data.liked);
      setLikeCount(data.likeCount);
    } catch (error) {
      console.error("Like error:", error);
    } finally {
      setLikeLoading(false);
    }
  };

  // Add comment handler
  const handleAddComment = async () => {
    if (!newComment.trim() || !user?.token || commentLoading) return;
    setCommentLoading(true);
    try {
      const data = await API.addComment(id, { content: newComment.trim() }, user.token);
      setComments((prev) => [...prev, { ...data, replies: [] }]);
      setNewComment("");
    } catch (error) {
      console.error("Add comment error:", error);
    } finally {
      setCommentLoading(false);
    }
  };

  // Add reply handler
  const handleAddReply = async (parentCommentId) => {
    if (!replyContent.trim() || !user?.token || commentLoading) return;
    setCommentLoading(true);
    try {
      const data = await API.addComment(
        id,
        { content: replyContent.trim(), parentCommentId },
        user.token
      );
      setComments((prev) =>
        prev.map((c) =>
          c._id === parentCommentId
            ? { ...c, replies: [...(c.replies || []), data] }
            : c
        )
      );
      setReplyContent("");
      setReplyingTo(null);
    } catch (error) {
      console.error("Add reply error:", error);
    } finally {
      setCommentLoading(false);
    }
  };

  // Delete comment handler
  const handleDeleteComment = async (commentId, parentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await API.deleteComment(commentId, user.token);
      if (parentId) {
        // It's a reply
        setComments((prev) =>
          prev.map((c) =>
            c._id === parentId
              ? { ...c, replies: (c.replies || []).filter((r) => r._id !== commentId) }
              : c
          )
        );
      } else {
        // It's a top-level comment
        setComments((prev) => prev.filter((c) => c._id !== commentId));
      }
    } catch (error) {
      console.error("Delete comment error:", error);
    }
  };

  if (loading) return <Typography>Loading post...</Typography>;
  if (!post) return <Typography>Post not found.</Typography>;

  // Extract userId safely from user object
  const userId = user?.id || user?._id || null;
  const authorId = post.author?._id ? post.author._id.toString() : null;

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Box sx={{ position: "relative", minHeight: "100vh", p: 3, pt: 10 }}>
      <Box
        sx={{
          maxWidth: 800,
          mx: "auto",
          p: 3,
          border: "1px solid #e8e0d4",
          borderRadius: "14px",
          boxShadow: "0 4px 20px rgba(44,36,24,0.06)",
          backgroundColor: "#fff",
        }}
      >
        {/* Category Badge */}
        {post.category && (
          <Chip
            label={post.category}
            size="small"
            sx={{
              mb: 2,
              bgcolor: "#2d4a3e",
              color: "#faf7f2",
              fontWeight: 600,
            }}
          />
        )}

        <Typography variant="h4" fontWeight="bold" mb={2}>
          {post.title}
        </Typography>

        <Typography variant="subtitle1" color="text.secondary" mb={1}>
          By {post.author?.username || "Unknown Author"}
        </Typography>

        {post.createdAt && (
          <Typography variant="body2" color="text.secondary" mb={3}>
            {formatDate(post.createdAt)}
          </Typography>
        )}

        {post.imageUrl && (
          <Box
            component="img"
            src={getImageUrl(post.imageUrl)}
            alt={post.title}
            sx={{
              width: "100%",
              maxHeight: 400,
              objectFit: "cover",
              borderRadius: 2,
              mb: 3,
            }}
          />
        )}

        <Typography
          variant="body1"
          whiteSpace="pre-line"
          sx={{
            fontSize: "1.1rem",
            wordWrap: "break-word",
            overflowWrap: "break-word",
            wordBreak: "break-word",
          }}
        >
          {post.content}
        </Typography>

        {/* Like Button */}
        <Box
          sx={{
            mt: 3,
            display: "flex",
            alignItems: "center",
            gap: 2,
            p: 2,
            bgcolor: "#fafafa",
            borderRadius: 2,
          }}
        >
          <IconButton
            onClick={handleLikeToggle}
            disabled={likeLoading || !user}
            sx={{
              color: liked ? "#c45d35" : "#b0a692",
              transition: "all 0.2s ease",
              "&:hover": {
                transform: "scale(1.15)",
              },
            }}
          >
            {liked ? (
              <FavoriteIcon sx={{ fontSize: 28 }} />
            ) : (
              <FavoriteBorderIcon sx={{ fontSize: 28 }} />
            )}
          </IconButton>
          <Typography fontWeight="bold" fontSize="1.1rem">
            {likeCount} {likeCount === 1 ? "Like" : "Likes"}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, ml: 2, color: "#3d6b5e" }}>
            <ChatBubbleOutlineIcon />
            <Typography fontWeight="bold">
              {comments.reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0)} Comments
            </Typography>
          </Box>
        </Box>

        {/* Show Edit/Delete only if logged-in user is post author */}
        {user && post.author && user.id && post.author._id && user.id === post.author._id.toString() ? (
          <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
            <Button variant="contained" color="primary" onClick={handleEdit}>
              Edit
            </Button>
            <Button variant="outlined" color="error" onClick={handleDelete}>
              Delete
            </Button>
          </Box>
        ) : null}

        {/* Status notice for pending/rejected posts */}
        {post.status && post.status !== "approved" && userId === authorId && (
          <Box
            sx={{
              mt: 2,
              p: 2,
              borderRadius: 2,
              bgcolor: post.status === "pending" ? "#fff3e0" : "#ffebee",
              border: `1px solid ${post.status === "pending" ? "#ffcc80" : "#ef9a9a"}`,
            }}
          >
            <Typography fontWeight="bold" color={post.status === "pending" ? "warning.dark" : "error.dark"}>
              {post.status === "pending"
                ? "📝 This post is under review and not visible to others."
                : "❌ This post was rejected by an admin."}
            </Typography>
          </Box>
        )}
      </Box>

      {/* ============ COMMENTS SECTION ============ */}
      <Box
        sx={{
          maxWidth: 800,
          mx: "auto",
          mt: 4,
          p: 3,
          border: "1px solid #e8e0d4",
          borderRadius: "14px",
          boxShadow: "0 2px 12px rgba(44,36,24,0.05)",
          backgroundColor: "#fff",
        }}
      >
        <Typography variant="h5" fontWeight="bold" mb={3}>
          💬 Comments
        </Typography>

        {/* Add Comment Form */}
        {user ? (
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleAddComment();
                }
              }}
              multiline
              maxRows={3}
            />
            <Button
              variant="contained"
              onClick={handleAddComment}
              disabled={!newComment.trim() || commentLoading}
              sx={{ whiteSpace: "nowrap" }}
            >
              Post
            </Button>
          </Box>
        ) : (
          <Typography color="text.secondary" mb={2}>
            Log in to leave a comment.
          </Typography>
        )}

        <Divider sx={{ mb: 2 }} />

        {/* Comments List */}
        {comments.length === 0 ? (
          <Typography color="text.secondary" sx={{ textAlign: "center", py: 3 }}>
            No comments yet. Be the first to comment!
          </Typography>
        ) : (
          comments.map((comment) => (
            <Box key={comment._id} sx={{ mb: 3 }}>
              {/* Top-level comment */}
              <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: "#2d4a3e",
                    fontSize: "0.9rem",
                  }}
                >
                  {(comment.userId?.username || "?")[0].toUpperCase()}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography fontWeight="bold" fontSize="0.9rem">
                      {comment.userId?.username || "Unknown"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(comment.createdAt)}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mt: 0.5, whiteSpace: "pre-line" }}>
                    {comment.content}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
                    {user && (
                      <Button
                        size="small"
                        startIcon={<ReplyIcon sx={{ fontSize: 16 }} />}
                        onClick={() =>
                          setReplyingTo(replyingTo === comment._id ? null : comment._id)
                        }
                        sx={{ textTransform: "none", fontSize: "0.8rem", color: "#666" }}
                      >
                        Reply
                      </Button>
                    )}
                    {user && (user.id === comment.userId?._id || user.id === comment.userId?.toString()) && (
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteComment(comment._id, null)}
                        sx={{ color: "#999", "&:hover": { color: "#d32f2f" } }}
                      >
                        <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    )}
                  </Box>

                  {/* Reply input */}
                  {replyingTo === comment._id && (
                    <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder={`Reply to ${comment.userId?.username || ""}...`}
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleAddReply(comment._id);
                          }
                        }}
                      />
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => handleAddReply(comment._id)}
                        disabled={!replyContent.trim() || commentLoading}
                      >
                        Reply
                      </Button>
                    </Box>
                  )}

                  {/* Replies */}
                  {comment.replies &&
                    comment.replies.length > 0 &&
                    comment.replies.map((reply) => (
                      <Box
                        key={reply._id}
                        sx={{
                          display: "flex",
                          gap: 1.5,
                          alignItems: "flex-start",
                          mt: 1.5,
                          pl: 2,
                          borderLeft: "2px solid #e0e0e0",
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 28,
                            height: 28,
                            bgcolor: "#5a8a6a",
                            fontSize: "0.75rem",
                          }}
                        >
                          {(reply.userId?.username || "?")[0].toUpperCase()}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Typography fontWeight="bold" fontSize="0.85rem">
                              {reply.userId?.username || "Unknown"}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatDate(reply.createdAt)}
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ mt: 0.3, whiteSpace: "pre-line" }}>
                            {reply.content}
                          </Typography>
                          {user &&
                            (user.id === reply.userId?._id ||
                              user.id === reply.userId?.toString()) && (
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteComment(reply._id, comment._id)}
                                sx={{ color: "#999", "&:hover": { color: "#d32f2f" } }}
                              >
                                <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                              </IconButton>
                            )}
                        </Box>
                      </Box>
                    ))}
                </Box>
              </Box>
            </Box>
          ))
        )}
      </Box>

      <Button
        variant="contained"
        color="primary"
        size="large"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          zIndex: 2000,
          mr: 25,
          borderRadius: 3,
          boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
          textTransform: "none",
        }}
      >
        Back
      </Button>
    </Box>
  );
};

export default PostDetail;
