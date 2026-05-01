import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Chip, Button } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import AddIcon from "@mui/icons-material/Add";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { AuthContext } from "../context/AuthContext";
import { API, getImageUrl } from "../service/api";

const statusConfig = {
  pending: { bg: "#fdf6ee", color: "#b87530", border: "#e8d5b8", label: "Pending Review", emoji: "⏳" },
  approved: { bg: "#ecf5ef", color: "#2d6a4f", border: "#b0d9be", label: "Published", emoji: "✅" },
  rejected: { bg: "#fdf2f0", color: "#b5432a", border: "#f0c5be", label: "Rejected", emoji: "❌" },
};

const MyPosts = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyPosts = async () => {
      if (!user?.token) { navigate("/"); return; }
      try { setPosts(await API.getMyPosts(user.token)); }
      catch (error) { console.error("Error fetching my posts:", error); }
      finally { setLoading(false); }
    };
    fetchMyPosts();
  }, [user, navigate]);

  if (loading) return (
    <Box sx={{ pt: 12, textAlign: "center" }}>
      <Typography sx={{ color: "#7a6e5d" }}>Loading your posts...</Typography>
    </Box>
  );

  const pendingPosts = posts.filter((p) => p.status === "pending");
  const approvedPosts = posts.filter((p) => p.status === "approved");
  const rejectedPosts = posts.filter((p) => p.status === "rejected");

  const renderCard = (post) => {
    const status = statusConfig[post.status] || statusConfig.pending;
    return (
      <Box
        key={post._id}
        onClick={() => navigate(`/posts/${post._id}`)}
        sx={{
          border: "1px solid #e8e0d4",
          borderRadius: "16px",
          overflow: "hidden",
          background: "#fff",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          transition: "all 0.3s ease",
          boxShadow: "0 2px 12px rgba(44,36,24,0.04)",
          userSelect: "none",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0 10px 30px rgba(44,36,24,0.1)",
          },
        }}
      >
        {post.imageUrl ? (
          <Box component="img" src={getImageUrl(post.imageUrl)} alt={post.title}
            sx={{ width: "100%", height: 160, objectFit: "cover" }} />
        ) : (
          <Box sx={{
            width: "100%", height: 100, display: "flex", alignItems: "center", justifyContent: "center",
            background: "linear-gradient(135deg, #f5f0e8, #ece4d6)",
          }}>
            <Typography sx={{ fontSize: "2rem", opacity: 0.3 }}>🌿</Typography>
          </Box>
        )}

        <Box sx={{ p: 2.5, flex: 1, display: "flex", flexDirection: "column", gap: 1 }}>
          {/* Status + Category row */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Chip label={post.category} size="small"
              sx={{ bgcolor: "#2d4a3e", color: "#faf7f2", fontWeight: 600, fontSize: "0.7rem", height: 24 }} />
            <Chip
              label={`${status.emoji} ${status.label}`}
              size="small"
              sx={{
                bgcolor: status.bg, color: status.color, fontWeight: 600,
                fontSize: "0.7rem", height: 24,
                border: `1px solid ${status.border}`,
              }}
            />
          </Box>

          <Typography sx={{
            fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.1rem",
            color: "#2c2418", lineHeight: 1.3,
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
          }}>{post.title}</Typography>

          <Typography sx={{
            fontSize: "0.85rem", color: "#8a7e6d", lineHeight: 1.55,
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
          }}>{post.content}</Typography>

          {/* Stats */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: "auto", pt: 1.5, borderTop: "1px solid #f0ebe3" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <FavoriteIcon sx={{ fontSize: 14, color: "#c45d35" }} />
              <Typography sx={{ fontSize: "0.78rem", fontWeight: 600, color: "#7a6e5d" }}>{post.likeCount || 0}</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <ChatBubbleOutlineIcon sx={{ fontSize: 14, color: "#3d6b5e" }} />
              <Typography sx={{ fontSize: "0.78rem", fontWeight: 600, color: "#7a6e5d" }}>{post.commentCount || 0}</Typography>
            </Box>
            <Typography sx={{ fontSize: "0.72rem", color: "#b0a692", ml: "auto" }}>
              {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  };

  const renderSection = (title, emoji, color, postsArr) => {
    if (postsArr.length === 0) return null;
    return (
      <Box sx={{ mb: 5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
          <Box sx={{
            width: 36, height: 36, borderRadius: "10px",
            backgroundColor: `${color}15`, display: "flex",
            alignItems: "center", justifyContent: "center",
            border: `1px solid ${color}25`,
          }}>
            <Typography sx={{ fontSize: "1.1rem" }}>{emoji}</Typography>
          </Box>
          <Box>
            <Typography sx={{
              fontFamily: "'Playfair Display', serif", fontWeight: 700,
              fontSize: "1.25rem", color: "#2c2418", lineHeight: 1,
            }}>
              {title}
            </Typography>
            <Typography sx={{ fontSize: "0.78rem", color: "#b0a692", mt: 0.2 }}>
              {postsArr.length} {postsArr.length === 1 ? "post" : "posts"}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 2.5 }}>
          {postsArr.map(renderCard)}
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ pt: 10, px: 3, maxWidth: 1200, mx: "auto", pb: 6 }}>
      {/* Header area */}
      <Box sx={{
        display: "flex", flexWrap: "wrap", justifyContent: "space-between",
        alignItems: "flex-end", mb: 4, gap: 2,
      }}>
        <Box>
          <Typography sx={{
            fontFamily: "'Playfair Display', serif", fontSize: "2.2rem",
            fontWeight: 800, color: "#2d4a3e", lineHeight: 1.2,
          }}>
            My Posts
          </Typography>
          <Typography sx={{ color: "#7a6e5d", fontSize: "0.95rem", mt: 0.5 }}>
            Track your stories and their approval status
          </Typography>
        </Box>

        <Button
          variant="contained" startIcon={<EditNoteIcon />}
          onClick={() => navigate("/create-post")}
          sx={{
            borderRadius: "12px", px: 3.5, py: 1.2,
            fontSize: "0.92rem", fontWeight: 600, textTransform: "none",
            backgroundColor: "#c45d35",
            boxShadow: "0 4px 15px rgba(196,93,53,0.25)",
            "&:hover": { backgroundColor: "#a84d2b", transform: "translateY(-1px)" },
          }}
        >
          Write New Story
        </Button>
      </Box>

      {/* Summary stats */}
      {posts.length > 0 && (
        <Box sx={{ display: "flex", gap: 2, mb: 4, flexWrap: "wrap" }}>
          {[
            { label: "Total", count: posts.length, color: "#2d4a3e" },
            { label: "Published", count: approvedPosts.length, color: "#2d6a4f" },
            { label: "Pending", count: pendingPosts.length, color: "#b87530" },
            { label: "Rejected", count: rejectedPosts.length, color: "#b5432a" },
          ].map((s) => (
            <Box key={s.label} sx={{
              px: 2.5, py: 1.5, borderRadius: "12px", backgroundColor: "#fff",
              border: "1px solid #e8e0d4", minWidth: 100, textAlign: "center",
              boxShadow: "0 1px 6px rgba(44,36,24,0.03)",
            }}>
              <Typography sx={{ fontSize: "1.5rem", fontWeight: 800, color: s.color, lineHeight: 1 }}>
                {s.count}
              </Typography>
              <Typography sx={{ fontSize: "0.75rem", color: "#7a6e5d", fontWeight: 500, mt: 0.3 }}>
                {s.label}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      {posts.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 10, userSelect: "none" }}>
          <Typography sx={{ fontSize: "3.5rem", mb: 1.5 }}>📝</Typography>
          <Typography sx={{
            fontFamily: "'Playfair Display', serif", color: "#2d4a3e",
            fontSize: "1.4rem", fontWeight: 700, mb: 0.5,
          }}>
            Your story begins here
          </Typography>
          <Typography sx={{ color: "#7a6e5d", fontSize: "0.95rem", mb: 3 }}>
            You haven't written any stories yet. Start sharing your adventures!
          </Typography>
          <Button variant="contained" startIcon={<EditNoteIcon />} onClick={() => navigate("/create-post")}
            sx={{
              borderRadius: "12px", px: 4, py: 1.2, textTransform: "none",
              fontWeight: 600, fontSize: "0.95rem",
              backgroundColor: "#2d4a3e",
              "&:hover": { backgroundColor: "#3d6b5e" },
            }}>
            Start Writing
          </Button>
        </Box>
      ) : (
        <>
          {renderSection("Pending Review", "⏳", "#b87530", pendingPosts)}
          {renderSection("Published", "✅", "#2d6a4f", approvedPosts)}
          {renderSection("Rejected", "❌", "#b5432a", rejectedPosts)}
        </>
      )}
    </Box>
  );
};

export default MyPosts;
