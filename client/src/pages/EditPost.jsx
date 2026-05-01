import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { API, getImageUrl } from "../service/api";
import { AuthContext } from "../context/AuthContext";
import FileUpload from "../components/FileUpload";

const categories = [
  "Adventure", "Food", "Culture", "Nature", "City",
  "Technology", "Lifestyle", "Travel", "Health", "Science",
  "Education", "Business", "Entertainment", "Sports", "Art",
  "Finance", "Fashion", "Photography",
];

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  React.useEffect(() => {
    if (!user) navigate('/', { replace: true });
  }, [user, navigate]);

  const [post, setPost] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await API.getPostById(id);
        setPost(data); setTitle(data.title); setContent(data.content);
        setCategory(data.category || "Adventure"); setImageUrl(data.imageUrl || "");
      } catch (err) { setError("Failed to fetch post"); }
      finally { setLoading(false); }
    };
    fetchPost();
  }, [id]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const form = new FormData();
    form.append("image", file);
    try {
      const response = await API.uploadImage(form, user.token);
      setImageUrl(response.imageUrl);
    } catch (err) { console.error("Image upload failed:", err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!title.trim() || !content.trim()) { setError("Title and content are required"); return; }
    try {
      const response = await API.updatePost(id, { title, content, category, imageUrl }, user.token);
      if (response) navigate(user ? "/home" : "/", { replace: true });
    } catch (err) { setError(err.response?.data?.message || "Failed to update post"); }
  };

  if (loading) return <Typography sx={{ pt: 12, textAlign: "center", color: "#7a6e5d" }}>Loading...</Typography>;
  if (error && !post) return <Typography sx={{ pt: 12, textAlign: "center" }} color="error">{error}</Typography>;
  if (!post) return <Typography sx={{ pt: 12, textAlign: "center" }}>Post not found.</Typography>;

  const userId = user?.id || user?._id;
  if (!userId || userId !== post.author._id.toString()) {
    return <Typography sx={{ pt: 12, textAlign: "center" }}>Not authorized to edit this post.</Typography>;
  }

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px", fontFamily: "'Inter', sans-serif",
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#2d4a3e" },
      "&.Mui-focused": { boxShadow: "0 0 0 3px rgba(45,74,62,0.1)" },
    },
    "& .MuiInputLabel-root.Mui-focused": { color: "#2d4a3e" },
  };

  return (
    <Box
      component="form" onSubmit={handleSubmit}
      sx={{
        maxWidth: 680, mx: "auto", mt: 12, mb: 5, px: 3,
        display: "flex", flexDirection: "column", gap: 2.5,
        animation: "fadeInUp 0.5s ease-out",
      }}
    >
      <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 800, color: "#2d4a3e" }}>
        Edit Post
      </Typography>

      <Box sx={{ p: 2, borderRadius: "10px", bgcolor: "#fdf6ee", border: "1px solid #e8d5b8" }}>
        <Typography sx={{ fontSize: "0.88rem", color: "#b87530", fontWeight: 500 }}>
          ⚠️ Editing will reset the post to pending status for admin review.
        </Typography>
      </Box>

      {error && <Typography color="error" sx={{ fontSize: "0.9rem" }}>{error}</Typography>}

      <TextField label="Title" fullWidth required value={title}
        onChange={(e) => setTitle(e.target.value)} sx={inputSx} />

      <TextField label="Content" fullWidth required multiline minRows={6}
        value={content} onChange={(e) => setContent(e.target.value)} sx={inputSx} />

      <FormControl fullWidth>
        <InputLabel>Category</InputLabel>
        <Select value={category} label="Category" onChange={(e) => setCategory(e.target.value)}
          sx={{ borderRadius: "10px", "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#2d4a3e" } }}>
          {categories.map((cat) => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
        </Select>
      </FormControl>

      <FileUpload onFileChange={handleFileChange} />
      {imageUrl && (
        <Box component="img" src={getImageUrl(imageUrl)} alt="Preview"
          sx={{ width: "100%", maxHeight: 250, objectFit: "cover", borderRadius: "12px", border: "1px solid #e8e0d4" }} />
      )}

      <Box sx={{ display: "flex", gap: 2 }}>
        <Button variant="contained" type="submit" disabled={!title.trim() || !content.trim()}
          sx={{
            borderRadius: "10px", px: 3, py: 1.1, textTransform: "none", fontWeight: 600,
            backgroundColor: "#2d4a3e", "&:hover": { backgroundColor: "#3d6b5e" },
          }}>
          Save Changes
        </Button>
        <Button variant="outlined" onClick={() => navigate(`/posts/${id}`)}
          sx={{
            borderRadius: "10px", px: 3, textTransform: "none", fontWeight: 600,
            borderColor: "#c4b9a8", color: "#5c5347",
            "&:hover": { borderColor: "#2d4a3e", color: "#2d4a3e" },
          }}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default EditPost;
