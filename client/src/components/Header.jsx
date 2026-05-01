import React, { useState, useContext } from "react";
import {
  AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem,
  Tooltip, Chip, Box, Avatar, Divider,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => { logout(); navigate("/"); handleMenuClose(); };

  const handleHomeClick = () => {
    if (location.pathname === "/home") {
      window.scroll({ top: 0, left: 0, behavior: "smooth" });
    } else { navigate("/home"); }
  };

  const isActive = (path) => location.pathname === path;

  const navLinkSx = (path) => ({
    fontSize: "1rem",
    fontWeight: 700,
    fontFamily: "'Inter', sans-serif",
    textTransform: "none",
    borderRadius: "10px",
    px: 2.5,
    py: 1,
    color: isActive(path) ? "#1a2e24" : "#3d3428",
    backgroundColor: isActive(path) ? "rgba(45, 74, 62, 0.08)" : "transparent",
    transition: "all 0.25s ease",
    letterSpacing: "0.01em",
    position: "relative",
    "&::after": isActive(path) ? {
      content: '""',
      position: "absolute",
      bottom: 4,
      left: "25%",
      width: "50%",
      height: "2.5px",
      backgroundColor: "#c45d35",
      borderRadius: "2px",
    } : {},
    "&:hover": {
      backgroundColor: "rgba(45, 74, 62, 0.06)",
      color: "#1a2e24",
    },
  });

  return (
    <AppBar position="fixed" elevation={0} sx={{
      backgroundColor: "rgba(250, 247, 242, 0.92)",
      backdropFilter: "blur(16px)",
      borderBottom: "1px solid #e8e0d4",
      zIndex: (theme) => theme.zIndex.drawer + 1,
    }}>
      <Toolbar sx={{
        display: "flex",
        justifyContent: "space-between",
        maxWidth: 1200,
        width: "100%",
        mx: "auto",
        px: { xs: 2, md: 3 },
        minHeight: "64px !important",
      }}>
        {/* Logo */}
        <Box
          onClick={handleHomeClick}
          sx={{
            display: "flex", alignItems: "center", gap: 1.2,
            cursor: "pointer", transition: "opacity 0.2s",
            "&:hover": { opacity: 0.8 },
          }}
        >
          <Box sx={{
            width: 36, height: 36, borderRadius: "9px",
            background: "linear-gradient(145deg, #2d4a3e, #3d6b5e)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 8px rgba(45,74,62,0.25)",
          }}>
            <Typography sx={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.15rem", fontWeight: 800, color: "#faf7f2",
              lineHeight: 1,
            }}>I</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "baseline" }}>
            <Typography sx={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.5rem", fontWeight: 800, color: "#2d4a3e",
              letterSpacing: "-0.03em", lineHeight: 1,
            }}>Ink</Typography>
            <Typography sx={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.5rem", fontWeight: 800, color: "#c45d35",
              letterSpacing: "-0.03em", lineHeight: 1,
            }}>pulse</Typography>
          </Box>
        </Box>

        {/* Navigation */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
          <Button sx={navLinkSx("/home")} onClick={handleHomeClick}>
            Home
          </Button>
          <Button sx={navLinkSx("/my-posts")} onClick={() => navigate("/my-posts")}>
            My Posts
          </Button>
          <Button sx={navLinkSx("/about")} onClick={() => navigate("/about")}>
            About
          </Button>

          {user?.role === "admin" && (
            <>
              <Box sx={{ width: "1px", height: 24, backgroundColor: "#e0d6c8", mx: 0.5 }} />
              <Button
                startIcon={<AdminPanelSettingsIcon sx={{ fontSize: 19 }} />}
                sx={{
                  ...navLinkSx("/admin"),
                  color: "#c45d35",
                  backgroundColor: isActive("/admin") ? "rgba(196, 93, 53, 0.08)" : "transparent",
                  "&:hover": {
                    backgroundColor: "rgba(196, 93, 53, 0.06)",
                    color: "#a84d2b",
                  },
                  "&::after": isActive("/admin") ? {
                    content: '""', position: "absolute", bottom: 4, left: "25%", width: "50%",
                    height: "2.5px", backgroundColor: "#c45d35", borderRadius: "2px",
                  } : {},
                }}
                onClick={() => navigate("/admin")}
              >
                Admin
              </Button>
            </>
          )}
        </Box>

        {/* Profile */}
        <Tooltip title="Profile">
          <IconButton onClick={handleMenuOpen} sx={{ p: 0.5 }}>
            <Avatar sx={{
              width: 40, height: 40, fontSize: "1rem", fontWeight: 700,
              fontFamily: "'Inter', sans-serif",
              backgroundColor: "#2d4a3e", color: "#faf7f2",
              boxShadow: "0 2px 8px rgba(45,74,62,0.2)",
            }}>
              {(user?.username || "U")[0].toUpperCase()}
            </Avatar>
          </IconButton>
        </Tooltip>

        <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          PaperProps={{ sx: {
            mt: 1.5, borderRadius: "14px", boxShadow: "0 10px 40px rgba(44,36,24,0.12)",
            border: "1px solid #e8e0d4", minWidth: 220, p: 1, bgcolor: "#faf7f2",
          } }}>
          <Box sx={{ px: 2, py: 1.2 }}>
            <Typography sx={{ fontWeight: 700, fontSize: "1rem", color: "#2c2418" }}>
              {user?.username || "Guest"}
            </Typography>
            <Typography sx={{ fontSize: "0.82rem", color: "#7a6e5d", mt: 0.2 }}>
              {user?.email || ""}
            </Typography>
            {user?.role === "admin" && (
              <Chip label="Admin" size="small" sx={{
                mt: 0.8, height: 22, fontSize: "0.72rem", fontWeight: 700,
                bgcolor: "#c45d35", color: "white", borderRadius: "6px",
              }} />
            )}
          </Box>
          <Divider sx={{ my: 0.8, borderColor: "#e8e0d4" }} />
          <MenuItem onClick={handleLogout} sx={{
            borderRadius: "8px", mx: 0.5, py: 1, color: "#c44536",
            fontWeight: 600, fontSize: "0.92rem", gap: 1.2,
            "&:hover": { backgroundColor: "rgba(196,69,54,0.06)" },
          }}>
            <LogoutRoundedIcon sx={{ fontSize: 19 }} />
            Sign Out
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
