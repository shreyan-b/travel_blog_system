import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import BlockIcon from "@mui/icons-material/Block";
import CheckIcon from "@mui/icons-material/Check";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { AuthContext } from "../context/AuthContext";
import { API } from "../service/api";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [stats, setStats] = useState(null);
  const [pendingPosts, setPendingPosts] = useState([]);
  const [approvedPosts, setApprovedPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.token || user?.role !== "admin") {
      navigate("/home", { replace: true });
      return;
    }
    fetchAll();
  }, [user, navigate]);

  const fetchAll = async () => {
    try {
      const [statsData, pending, approved, usersData] = await Promise.all([
        API.getAdminStats(user.token),
        API.getPendingPosts(user.token),
        API.getApprovedPosts(user.token),
        API.getAllUsers(user.token),
      ]);
      setStats(statsData);
      setPendingPosts(pending);
      setApprovedPosts(approved);
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching admin data:", error);
      if (error.response?.status === 403) navigate("/home", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (postId) => {
    try {
      await API.approvePost(postId, user.token);
      const post = pendingPosts.find((p) => p._id === postId);
      setPendingPosts((prev) => prev.filter((p) => p._id !== postId));
      if (post) setApprovedPosts((prev) => [{ ...post, status: "approved" }, ...prev]);
      setStats((prev) => prev ? { ...prev, pendingPosts: prev.pendingPosts - 1, approvedPosts: prev.approvedPosts + 1 } : prev);
    } catch (error) { console.error("Approve error:", error); }
  };

  const handleReject = async (postId) => {
    try {
      await API.rejectPost(postId, user.token);
      setPendingPosts((prev) => prev.filter((p) => p._id !== postId));
      setStats((prev) => prev ? { ...prev, pendingPosts: prev.pendingPosts - 1 } : prev);
    } catch (error) { console.error("Reject error:", error); }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Delete this post permanently?")) return;
    try {
      await API.adminDeletePost(postId, user.token);
      setApprovedPosts((prev) => prev.filter((p) => p._id !== postId));
      setStats((prev) => prev ? { ...prev, totalPosts: prev.totalPosts - 1, approvedPosts: prev.approvedPosts - 1 } : prev);
    } catch (error) { console.error("Delete post error:", error); }
  };

  const handleSuspendUser = async (userId) => {
    try {
      const updated = await API.suspendUser(userId, user.token);
      setUsers((prev) => prev.map((u) => (u._id === userId ? updated : u)));
    } catch (error) { console.error("Suspend error:", error); }
  };

  const handleUnsuspendUser = async (userId) => {
    try {
      const updated = await API.unsuspendUser(userId, user.token);
      setUsers((prev) => prev.map((u) => (u._id === userId ? updated : u)));
    } catch (error) { console.error("Unsuspend error:", error); }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Delete this user and all their content?")) return;
    try {
      await API.deleteUser(userId, user.token);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      setStats((prev) => prev ? { ...prev, totalUsers: prev.totalUsers - 1 } : prev);
    } catch (error) { console.error("Delete user error:", error); }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh", pt: 10 }}>
        <Typography sx={{ color: "#8b8fa3" }}>Loading admin dashboard...</Typography>
      </Box>
    );
  }

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  const statCards = [
    { label: "Users", value: stats?.totalUsers, icon: <PeopleOutlineIcon sx={{ fontSize: 26 }} />, gradient: "linear-gradient(135deg, #2d4a3e, #3d6b5e)" },
    { label: "Total Posts", value: stats?.totalPosts, icon: <DescriptionOutlinedIcon sx={{ fontSize: 26 }} />, gradient: "linear-gradient(135deg, #4a7a6a, #5a9a7a)" },
    { label: "Pending", value: stats?.pendingPosts, icon: <HourglassBottomIcon sx={{ fontSize: 26 }} />, gradient: "linear-gradient(135deg, #c45d35, #d4783f)" },
    { label: "Published", value: stats?.approvedPosts, icon: <TaskAltIcon sx={{ fontSize: 26 }} />, gradient: "linear-gradient(135deg, #3d7a5f, #5a9a7a)" },
    { label: "Likes", value: stats?.totalLikes, icon: <FavoriteBorderIcon sx={{ fontSize: 26 }} />, gradient: "linear-gradient(135deg, #b5432a, #c45d35)" },
    { label: "Comments", value: stats?.totalComments, icon: <ChatBubbleOutlineIcon sx={{ fontSize: 26 }} />, gradient: "linear-gradient(135deg, #7a6a4a, #9a8a6a)" },
  ];

  const tableSx = {
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
    border: "1px solid rgba(0,0,0,0.05)",
    "& .MuiTableHead-root": {
      backgroundColor: "#faf7f2",
      "& .MuiTableCell-head": {
        fontWeight: 700,
        fontSize: "0.8rem",
        color: "#6b7280",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        borderBottom: "1px solid #e8e0d4",
        py: 1.5,
      },
    },
    "& .MuiTableBody-root .MuiTableRow-root": {
      transition: "background-color 0.15s ease",
      "&:hover": { backgroundColor: "#faf7f2" },
      "& .MuiTableCell-root": {
        fontSize: "0.9rem",
        py: 1.8,
        borderBottom: "1px solid #f0ebe3",
      },
    },
  };

  return (
    <Box sx={{ pt: 10, px: 3, maxWidth: 1400, mx: "auto", pb: 6 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 800, color: "#2d4a3e" }}>
          Admin Dashboard
        </Typography>
        <Typography sx={{ color: "#7a6e5d", fontSize: "0.95rem", mt: 0.5 }}>
          Manage posts, users, and content moderation
        </Typography>
      </Box>

      {/* Stats */}
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 2, mb: 4 }}>
        {statCards.map((stat) => (
          <Card
            key={stat.label}
            sx={{
              background: stat.gradient,
              borderRadius: "16px",
              boxShadow: "0 4px 16px rgba(44,36,24,0.08)",
              transition: "transform 0.2s ease",
              userSelect: "none",
              "&:hover": { transform: "translateY(-3px)", boxShadow: "0 8px 25px rgba(44,36,24,0.12)" },
            }}
          >
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, p: "20px 22px !important" }}>
              <Box sx={{
                opacity: 0.85, color: "white",
                width: 44, height: 44, borderRadius: "12px",
                backgroundColor: "rgba(255,255,255,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>{stat.icon}</Box>
              <Box>
                <Typography sx={{ fontSize: "1.8rem", fontWeight: 800, color: "white", lineHeight: 1 }}>
                  {stat.value ?? 0}
                </Typography>
                <Typography sx={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.75)", fontWeight: 500, mt: 0.3 }}>
                  {stat.label}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Tabs */}
      <Box sx={{
        mb: 3,
        borderRadius: "14px",
        overflow: "hidden",
        backgroundColor: "#fff",
        boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
        border: "1px solid #e8e0d4",
      }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="fullWidth"
          TabIndicatorProps={{
            sx: { height: 3, borderRadius: "3px", background: "linear-gradient(135deg, #2d4a3e, #3d6b5e)" },
          }}
          sx={{
            "& .MuiTab-root": {
              fontWeight: 600,
              fontSize: "0.9rem",
              textTransform: "none",
              fontFamily: "'Inter', sans-serif",
              color: "#7a6e5d",
              py: 1.5,
              "&.Mui-selected": { color: "#2d4a3e" },
            },
          }}
        >
          <Tab label={`Moderation (${pendingPosts.length})`} />
          <Tab label={`Published (${approvedPosts.length})`} />
          <Tab label={`Users (${users.length})`} />
        </Tabs>
      </Box>

      {/* Tab 0: Moderation */}
      {tab === 0 && (
        pendingPosts.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography sx={{ fontSize: "3rem", mb: 1 }}>✅</Typography>
            <Typography sx={{ color: "#8b8fa3", fontWeight: 500, fontSize: "1.1rem" }}>All caught up! No pending posts.</Typography>
          </Box>
        ) : (
          <TableContainer component={Paper} sx={tableSx}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Author</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingPosts.map((post) => (
                  <TableRow key={post._id}>
                    <TableCell>
                      <Typography
                        sx={{ fontWeight: 600, cursor: "pointer", "&:hover": { color: "#3d6b5e" }, transition: "color 0.2s" }}
                        onClick={() => navigate(`/posts/${post._id}`)}
                      >
                        {post.title}
                      </Typography>
                    </TableCell>
                    <TableCell>{post.author?.username || "Unknown"}</TableCell>
                    <TableCell><Chip label={post.category} size="small" sx={{ fontWeight: 600, fontSize: "0.75rem", bgcolor: "#f5f0e8", color: "#5c5347" }} /></TableCell>
                    <TableCell sx={{ color: "#7a6e5d" }}>{formatDate(post.createdAt)}</TableCell>
                    <TableCell align="center">
                      <IconButton onClick={() => handleApprove(post._id)} sx={{ color: "#3d7a5f", "&:hover": { backgroundColor: "#ecf5ef" } }}>
                        <CheckCircleIcon />
                      </IconButton>
                      <IconButton onClick={() => handleReject(post._id)} sx={{ color: "#c44536", "&:hover": { backgroundColor: "#fdf2f0" } }}>
                        <CancelIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )
      )}

      {/* Tab 1: Published */}
      {tab === 1 && (
        approvedPosts.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography sx={{ fontSize: "3rem", mb: 1 }}>📝</Typography>
            <Typography sx={{ color: "#8b8fa3", fontWeight: 500 }}>No published posts yet.</Typography>
          </Box>
        ) : (
          <TableContainer component={Paper} sx={tableSx}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Author</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {approvedPosts.map((post) => (
                  <TableRow key={post._id}>
                    <TableCell>
                      <Typography sx={{ fontWeight: 600, cursor: "pointer", "&:hover": { color: "#3d6b5e" }, transition: "color 0.2s" }}
                        onClick={() => navigate(`/posts/${post._id}`)}>{post.title}</Typography>
                    </TableCell>
                    <TableCell>{post.author?.username || "Unknown"}</TableCell>
                    <TableCell><Chip label={post.category} size="small" sx={{ fontWeight: 600, fontSize: "0.75rem", bgcolor: "#f5f0e8", color: "#5c5347" }} /></TableCell>
                    <TableCell sx={{ color: "#7a6e5d" }}>{formatDate(post.createdAt)}</TableCell>
                    <TableCell align="center">
                      <IconButton onClick={() => handleDeletePost(post._id)} sx={{ color: "#c44536", "&:hover": { backgroundColor: "#fdf2f0" } }}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )
      )}

      {/* Tab 2: Users */}
      {tab === 2 && (
        <TableContainer component={Paper} sx={tableSx}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Joined</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u._id}>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Avatar sx={{ width: 32, height: 32, fontSize: "0.85rem", fontWeight: 700, background: "linear-gradient(135deg, #2d4a3e, #3d6b5e)" }}>
                        {(u.username || "U")[0].toUpperCase()}
                      </Avatar>
                      <Typography sx={{ fontWeight: 600 }}>{u.username}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: "#6b7280" }}>{u.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={u.role}
                      size="small"
                      sx={{
                        fontWeight: 700,
                        fontSize: "0.7rem",
                        ...(u.role === "admin"
                          ? { backgroundColor: "#c45d35", color: "white" }
                          : { bgcolor: "#f5f0e8", color: "#5c5347" }),
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={u.isSuspended ? "Suspended" : "Active"}
                      size="small"
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.7rem",
                        ...(u.isSuspended
                          ? { bgcolor: "#fdf2f0", color: "#c44536", border: "1px solid #f0c5be" }
                          : { bgcolor: "#ecf5ef", color: "#2d6a4f", border: "1px solid #b0d9be" }),
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: "#8b8fa3" }}>{formatDate(u.createdAt)}</TableCell>
                  <TableCell align="center">
                    {u._id !== user.id ? (
                      <>
                        {u.isSuspended ? (
                          <IconButton onClick={() => handleUnsuspendUser(u._id)} sx={{ color: "#3d7a5f" }} title="Unsuspend">
                            <CheckIcon />
                          </IconButton>
                        ) : (
                          <IconButton onClick={() => handleSuspendUser(u._id)} sx={{ color: "#d4a03c" }} title="Suspend">
                            <BlockIcon />
                          </IconButton>
                        )}
                        <IconButton onClick={() => handleDeleteUser(u._id)} sx={{ color: "#c44536" }} title="Delete">
                          <DeleteIcon />
                        </IconButton>
                      </>
                    ) : (
                      <Chip label="You" size="small" sx={{ fontWeight: 600, fontSize: "0.7rem", bgcolor: "#f5f0e8", color: "#2d4a3e" }} />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default AdminDashboard;
