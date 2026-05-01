import React from "react";
import { Box, Typography, Link, IconButton } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import ExploreIcon from "@mui/icons-material/Explore";
import GroupsIcon from "@mui/icons-material/Groups";
import FavoriteIcon from "@mui/icons-material/Favorite";

const features = [
  {
    icon: <ExploreIcon sx={{ fontSize: 32, color: "#c45d35" }} />,
    title: "Discover Stories",
    desc: "Explore travel tales from adventurers across the globe, from hidden trails to bustling city streets.",
  },
  {
    icon: <GroupsIcon sx={{ fontSize: 32, color: "#3d6b5e" }} />,
    title: "Community Driven",
    desc: "Join a welcoming community where every voice matters and every journey is worth sharing.",
  },
  {
    icon: <FavoriteIcon sx={{ fontSize: 32, color: "#c45d35" }} />,
    title: "Share Your Passion",
    desc: "Create, like, and comment on posts. Your stories inspire others to explore the unknown.",
  },
];

const About = () => {
  return (
    <Box sx={{ pt: 10, pb: 10 }}>
      {/* Hero */}
      <Box
        sx={{
          maxWidth: 850,
          mx: "auto",
          px: { xs: 3, sm: 5 },
          py: 6,
          textAlign: "center",
          animation: "fadeInUp 0.5s ease-out",
        }}
      >
        <Typography
          sx={{
            fontFamily: "'Playfair Display', serif",
            fontSize: { xs: "2rem", md: "2.6rem" },
            fontWeight: 800,
            color: "#2d4a3e",
            mb: 1.5,
          }}
        >
          About Inkpulse
        </Typography>
        <Typography
          sx={{
            fontSize: "1.05rem",
            color: "#7a6e5d",
            lineHeight: 1.8,
            maxWidth: 650,
            mx: "auto",
          }}
        >
          A space where wanderers share their journeys, food lovers celebrate
          flavors, and culture seekers find their tribe. We believe every
          adventure is worth telling.
        </Typography>
      </Box>

      {/* Feature Cards */}
      <Box
        sx={{
          maxWidth: 950,
          mx: "auto",
          px: 3,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 3,
          mb: 6,
        }}
      >
        {features.map((f, i) => (
          <Box
            key={i}
            sx={{
              backgroundColor: "#fff",
              border: "1px solid #e8e0d4",
              borderRadius: "14px",
              p: 3.5,
              textAlign: "center",
              boxShadow: "0 2px 12px rgba(44,36,24,0.04)",
              transition: "all 0.3s ease",
              animation: `fadeInUp 0.4s ease-out ${i * 0.1}s both`,
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 8px 30px rgba(44,36,24,0.08)",
              },
            }}
          >
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: "14px",
                backgroundColor: "#faf7f2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 2,
              }}
            >
              {f.icon}
            </Box>
            <Typography
              sx={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
                fontSize: "1.15rem",
                color: "#2d4a3e",
                mb: 1,
              }}
            >
              {f.title}
            </Typography>
            <Typography sx={{ fontSize: "0.9rem", color: "#7a6e5d", lineHeight: 1.6 }}>
              {f.desc}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Mission */}
      <Box
        sx={{
          maxWidth: 750,
          mx: "auto",
          px: { xs: 3, sm: 5 },
          py: 5,
          backgroundColor: "#fff",
          borderRadius: "16px",
          border: "1px solid #e8e0d4",
          boxShadow: "0 2px 15px rgba(44,36,24,0.04)",
          mb: 5,
        }}
      >
        <Typography
          sx={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "#2d4a3e",
            mb: 2,
            textAlign: "center",
          }}
        >
          Our Mission
        </Typography>
        <Typography sx={{ fontSize: "0.95rem", color: "#5c5347", lineHeight: 1.8, textAlign: "center" }}>
          Inkpulse is built for travelers, storytellers, and curious minds. We
          provide a refined and intuitive platform to share experiences, discover
          new perspectives, and connect with a global community of explorers.
          Every journey matters — and so does yours.
        </Typography>
      </Box>

      {/* GitHub */}
      <Box sx={{ textAlign: "center", pt: 2 }}>
        <Typography sx={{ color: "#7a6e5d", fontSize: "0.95rem", mb: 1, fontWeight: 500 }}>
          Interested in contributing?
        </Typography>
        <Link
          href="https://github.com/shreyan-b/FSD"
          target="_blank"
          rel="noopener"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
            color: "#2d4a3e",
            textDecoration: "none",
            fontWeight: 600,
            fontSize: "0.95rem",
            transition: "all 0.2s ease",
            "&:hover": { color: "#c45d35" },
          }}
        >
          <GitHubIcon sx={{ fontSize: 24 }} />
          View on GitHub
        </Link>
      </Box>
    </Box>
  );
};

export default About;
