import React, { useContext, useEffect, useState } from "react";
import {
  Button, Box, Typography, MenuItem, Select, FormControl, InputLabel,
  TextField, InputAdornment, Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import AddIcon from "@mui/icons-material/Add";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { API, getImageUrl } from "../service/api";

const categories = [
  "All", "Adventure", "Food", "Culture", "Nature", "City",
  "Technology", "Lifestyle", "Travel", "Health", "Science",
  "Education", "Business", "Entertainment", "Sports", "Art",
  "Finance", "Fashion", "Photography",
];

const categoryColors = {
  Adventure: "#c45d35", Food: "#b5432a", Culture: "#7b5ea7",
  Nature: "#3d7a5f", City: "#4a6fa5", Technology: "#3a7ca5",
  Lifestyle: "#a0527a", Travel: "#2d7d8a", Health: "#5a8a3d",
  Science: "#5a4a9a", Education: "#b89230", Business: "#4a5568",
  Entertainment: "#b5432a", Sports: "#3d7a3d", Art: "#8a3d5a",
  Finance: "#2d6a5a", Fashion: "#c45a7a", Photography: "#b87530",
};

const Home = () => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (location.state?.newPost) window.history.replaceState({}, document.title);
  }, [location.state]);

  useEffect(() => {
    const fetchProfile = async () => {
      try { const data = await API.getUserProfile(user.token); setProfile(data); }
      catch { logout(); navigate("/"); }
      finally { setLoading(false); }
    };
    if (user?.token) fetchProfile(); else navigate("/");
  }, [user, logout, navigate]);

  useEffect(() => {
    const fetchPosts = async () => {
      const params = new URLSearchParams();
      if (category && category !== "All") params.append("category", category);
      if (searchTerm.trim()) params.append("search", searchTerm.trim());
      if (sortBy === "oldest") params.append("sort", "oldest");
      else if (sortBy === "mostLiked") params.append("sort", "mostLiked");
      const qs = params.toString() ? `?${params.toString()}` : "";
      setPosts(await API.getPosts(qs));
    };
    fetchPosts();
  }, [category, sortBy, searchTerm]);

  if (loading) {
    return <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh", pt: 10 }}>
      <Typography sx={{ color: "#7a6e5d" }}>Loading...</Typography>
    </Box>;
  }

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px", backgroundColor: "#fff", fontSize: "0.95rem",
      "&.Mui-focused": { boxShadow: "0 0 0 3px rgba(45,74,62,0.1)" },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#2d4a3e" },
    },
  };
  const selectSx = {
    borderRadius: "10px", backgroundColor: "#fff", fontSize: "0.9rem",
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#2d4a3e" },
  };

  return (
    <>
      {/* Hero */}
      <Box sx={{
        width: "100%", minHeight: 380,
        background: "linear-gradient(160deg, #2d4a3e 0%, #1a332a 50%, #3d6b5e 100%)",
        pb: 8, pt: 10, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        position: "relative", overflow: "hidden",
        userSelect: "none",
      }}>
        <Box sx={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(196,93,53,0.18), transparent 70%)", top: -60, right: "5%", filter: "blur(40px)" }} />
        <Box sx={{ position: "absolute", width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle, rgba(212,160,60,0.15), transparent 70%)", bottom: -40, left: "8%", filter: "blur(35px)" }} />
        <Box sx={{ position: "absolute", width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(90,154,122,0.15), transparent 70%)", top: "30%", left: "40%", filter: "blur(30px)" }} />

        {/* Decorative top line */}
        <Box sx={{ width: 50, height: 3, borderRadius: 2, backgroundColor: "rgba(196,93,53,0.6)", mb: 3, zIndex: 1 }} />

        {/* Heading — single centered block */}
        <Box sx={{ textAlign: "center", zIndex: 1 }}>
          <Typography component="span" sx={{
            fontFamily: "'Playfair Display', serif",
            fontSize: { xs: "2.2rem", md: "3.5rem" },
            fontWeight: 800, color: "#faf7f2",
            letterSpacing: "-0.02em", lineHeight: 1.15,
          }}>
            Discover Amazing{" "}
          </Typography>
          <Typography component="span" sx={{
            fontFamily: "'Playfair Display', serif",
            fontSize: { xs: "2.2rem", md: "3.5rem" },
            fontWeight: 800, color: "#c45d35",
            letterSpacing: "-0.02em", lineHeight: 1.15,
            fontStyle: "italic",
          }}>
            Stories
          </Typography>
        </Box>

        <Typography sx={{
          color: "rgba(250,247,242,0.55)", fontSize: "1.1rem", mt: 2, zIndex: 1,
          fontWeight: 400, letterSpacing: "0.04em",
          fontFamily: "'Inter', sans-serif",
        }}>
          Explore travel blogs from around the world
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />}
          onClick={() => navigate(`/create-post?category=${encodeURIComponent(category)}`)}
          sx={{
            mt: 3.5, zIndex: 1, borderRadius: "12px", px: 4, py: 1.3,
            fontSize: "0.95rem", fontWeight: 600, textTransform: "none",
            backgroundColor: "#c45d35",
            boxShadow: "0 4px 18px rgba(196,93,53,0.35)",
            "&:hover": { backgroundColor: "#a84d2b", boxShadow: "0 6px 25px rgba(196,93,53,0.45)", transform: "translateY(-2px)" },
          }}
        >
          Write a Story
        </Button>
      </Box>

      {/* Search & Filter Bar */}
      <Box sx={{ mx: { xs: 2, md: 5, lg: 8 }, mt: -3.5, mb: 4, position: "relative", zIndex: 2 }}>
        <Box sx={{
          display: "flex", flexWrap: "wrap", gap: 2, p: { xs: 2, md: 2.5 },
          backgroundColor: "rgba(255,255,255,0.95)", borderRadius: "16px",
          boxShadow: "0 8px 40px rgba(44,36,24,0.1)",
          border: "1px solid #e8e0d4",
          backdropFilter: "blur(10px)",
          alignItems: "flex-end",
          borderLeft: "4px solid #c45d35",
        }}>
          <Box sx={{ flex: 4, minWidth: 300 }}>
            <TextField size="small" fullWidth placeholder="Search stories, topics, authors..." value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px", backgroundColor: "#faf7f2", fontSize: "0.9rem",
                  height: 38,
                  "&.Mui-focused": { boxShadow: "0 0 0 3px rgba(45,74,62,0.1)" },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#2d4a3e" },
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e0d6c8" },
                },
              }}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: "#b0a692", fontSize: 20 }} /></InputAdornment> }}
            />
          </Box>

          <Box sx={{ flex: 1.5, minWidth: 180 }}>
            <FormControl size="small" fullWidth>
              <InputLabel sx={{ fontSize: "0.85rem" }}>Sort By</InputLabel>
              <Select value={sortBy} label="Sort By" onChange={(e) => setSortBy(e.target.value)}
                sx={{
                  borderRadius: "10px", backgroundColor: "#faf7f2", fontSize: "0.85rem",
                  height: 38,
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#2d4a3e" },
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e0d6c8" },
                }}>
                <MenuItem value="newest">Newest First</MenuItem>
                <MenuItem value="oldest">Oldest First</MenuItem>
                <MenuItem value="mostLiked">Most Liked</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ flex: 1.5, minWidth: 180 }}>
            <FormControl size="small" fullWidth>
              <InputLabel sx={{ fontSize: "0.85rem" }}>Category</InputLabel>
              <Select value={category} label="Category" onChange={(e) => setCategory(e.target.value)}
                sx={{
                  borderRadius: "10px", backgroundColor: "#faf7f2", fontSize: "0.85rem",
                  height: 38,
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#2d4a3e" },
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e0d6c8" },
                }}>
                {categories.map((cat) => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Box>

      {/* Posts Grid */}
      <Box sx={{
        mx: { xs: 2, md: 5, lg: 8 },
        display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
        gap: 3, pb: 6,
      }}>
        {posts.length === 0 ? (
          <Box sx={{ gridColumn: "1 / -1", textAlign: "center", py: 8, userSelect: "none" }}>
            <Typography sx={{ fontSize: "3rem", mb: 1 }}>🌍</Typography>
            <Typography sx={{ color: "#7a6e5d", fontSize: "1.05rem", fontWeight: 500 }}>No stories found</Typography>
            <Typography sx={{ color: "#b0a692", fontSize: "0.88rem", mt: 0.5 }}>Try adjusting your search or filters</Typography>
          </Box>
        ) : (
          posts.map((post, i) => (
            <Box key={post._id} onClick={() => navigate(`/posts/${post._id}`)}
              sx={{
                borderRadius: "14px", overflow: "hidden", background: "#fff",
                boxShadow: "0 2px 10px rgba(44,36,24,0.05)", border: "1px solid #ece4d6",
                cursor: "pointer", display: "flex", flexDirection: "column",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                animation: `fadeInUp 0.4s ease-out ${i * 0.04}s both`,
                userSelect: "none",
                "&:hover": { transform: "translateY(-5px)", boxShadow: "0 10px 35px rgba(44,36,24,0.1)" },
              }}
            >
              {post.imageUrl ? (
                <Box component="img" src={getImageUrl(post.imageUrl)} alt={post.title}
                  sx={{ width: "100%", height: 160, objectFit: "cover" }} />
              ) : (
                <Box sx={{
                  width: "100%", height: 80,
                  background: `linear-gradient(135deg, ${categoryColors[post.category] || "#2d4a3e"}18, ${categoryColors[post.category] || "#2d4a3e"}08)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Typography sx={{ fontSize: "2.2rem", opacity: 0.35 }}>🌿</Typography>
                </Box>
              )}

              <Box sx={{ p: 2, flex: 1, display: "flex", flexDirection: "column" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                  <Chip label={post.category} size="small" sx={{
                    bgcolor: `${categoryColors[post.category] || "#2d4a3e"}12`,
                    color: categoryColors[post.category] || "#2d4a3e",
                    fontWeight: 600, fontSize: "0.7rem", height: 22,
                    border: `1px solid ${categoryColors[post.category] || "#2d4a3e"}25`,
                  }} />
                  <Typography sx={{ fontSize: "0.73rem", color: "#b0a692" }}>
                    {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </Typography>
                </Box>

                <Typography sx={{
                  fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.1rem",
                  color: "#2c2418", mb: 0.5, lineHeight: 1.35,
                  display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
                }}>{post.title}</Typography>

                {post.author && (
                  <Typography sx={{ fontSize: "0.78rem", color: "#7a6e5d", mb: 1 }}>
                    by {post.author.username || "Unknown"}
                  </Typography>
                )}

                <Typography sx={{
                  fontSize: "0.85rem", color: "#8a7e6d", lineHeight: 1.6, flex: 1,
                  display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden",
                }}>{post.content}</Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2, pt: 1.5, borderTop: "1px solid #f0ebe3" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <FavoriteIcon sx={{ fontSize: 15, color: "#c45d35" }} />
                    <Typography sx={{ fontSize: "0.78rem", fontWeight: 600, color: "#7a6e5d" }}>{post.likeCount || 0}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <ChatBubbleOutlineIcon sx={{ fontSize: 15, color: "#3d6b5e" }} />
                    <Typography sx={{ fontSize: "0.78rem", fontWeight: 600, color: "#7a6e5d" }}>{post.commentCount || 0}</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          ))
        )}
      </Box>
    </>
  );
};

export default Home;
