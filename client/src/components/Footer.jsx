import React from "react";
import { Box, Typography, Link } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        py: 3.5,
        px: 3,
        backgroundColor: "#2d4a3e",
        color: "rgba(250, 247, 242, 0.7)",
      }}
    >
      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
        }}
      >
        {/* Brand */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* Mini icon mark */}
          <Box sx={{
            width: 26, height: 26, borderRadius: "6px",
            backgroundColor: "rgba(250,247,242,0.12)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Typography sx={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "0.85rem", fontWeight: 800, color: "#faf7f2",
              lineHeight: 1,
            }}>I</Typography>
          </Box>
          <Box>
            <Box sx={{ display: "flex", alignItems: "baseline" }}>
              <Typography sx={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.05rem", fontWeight: 700, color: "#faf7f2",
                letterSpacing: "-0.02em",
              }}>Ink</Typography>
              <Typography sx={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.05rem", fontWeight: 700, color: "#c45d35",
                letterSpacing: "-0.02em",
              }}>pulse</Typography>
            </Box>
            <Typography sx={{ fontSize: "0.68rem", color: "rgba(250,247,242,0.35)", mt: -0.3 }}>
              Where stories find their voice
            </Typography>
          </Box>
        </Box>

        {/* Center tagline */}
        <Typography
          sx={{
            fontSize: "0.82rem",
            color: "rgba(250,247,242,0.4)",
            fontStyle: "italic",
            fontFamily: "'Playfair Display', serif",
            letterSpacing: "0.02em",
          }}
        >
          — crafted for wanderers & storytellers
        </Typography>

        {/* Right - GitHub */}
        <Link
          href="https://github.com/shreyan-b/FSD"
          target="_blank"
          rel="noopener"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.8,
            color: "rgba(250,247,242,0.5)",
            textDecoration: "none",
            fontSize: "0.82rem",
            transition: "color 0.2s",
            "&:hover": { color: "#faf7f2" },
          }}
        >
          <GitHubIcon sx={{ fontSize: 17 }} />
          Source
        </Link>
      </Box>
    </Box>
  );
};

export default Footer;
