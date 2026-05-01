import React, { useState, useEffect, useContext } from "react";
import { Box, TextField, Button, Typography, InputAdornment } from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { API } from "../service/api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const slideImages = [
  "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1920&q=80",
  "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1920&q=80",
  "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1920&q=80",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80",
  "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1920&q=80",
  "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1920&q=80",
];

const captions = [
  "Taj Mahal, Agra, India",
  "Fushimi Inari Shrine, Kyoto, Japan",
  "Cologne Cathedral, Germany",
  "Mount Everest Base, Nepal",
  "Streets of Paris, France",
  "Machu Picchu, Peru",
];

function AuthBox() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [isLogin, setIsLogin] = useState(true);
  const [inputs, setInputs] = useState({ email: "", password: "", name: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const timerRef = React.useRef(null);

  const startTimer = React.useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideImages.length);
    }, 4000);
  }, []);

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, [startTimer]);

  const goToSlide = (i) => {
    setCurrentSlide(i);
    startTimer();
  };

  useEffect(() => {
    setErrors({});
    setInputs({ email: "", password: "", name: "" });
  }, [isLogin]);

  const validateLogin = () => {
    const errs = {};
    if (!inputs.email) errs.email = "Email is required";
    if (!inputs.password) errs.password = "Password is required";
    return errs;
  };

  const validateSignup = () => {
    const errs = {};
    if (!inputs.name) errs.name = "Name is required";
    if (!inputs.email) errs.email = "Email is required";
    if (!inputs.password) errs.password = "Password is required";
    return errs;
  };

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleLogin = async () => {
    const validationErrors = validateLogin();
    if (Object.keys(validationErrors).length) { setErrors(validationErrors); return; }
    setLoading(true);
    try {
      const response = await API.authenticateLogin({ email: inputs.email, password: inputs.password });
      sessionStorage.setItem("token", response.token);
      login({ token: response.token, user: response.user });
      setLoading(false);
      navigate("/home");
    } catch (error) {
      setErrors({ general: error.response?.data?.message || "Login failed!" });
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    const validationErrors = validateSignup();
    if (Object.keys(validationErrors).length) { setErrors(validationErrors); return; }
    setLoading(true);
    try {
      await API.userSignup({ name: inputs.name, email: inputs.email, password: inputs.password });
      setLoading(false);
      setIsLogin(true);
      setInputs({ name: "", email: "", password: "" });
      setErrors({ general: "✅ Account created! Please log in." });
    } catch (error) {
      setLoading(false);
      setErrors({ general: error.response?.data?.message || "Signup failed!" });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") { isLogin ? handleLogin() : handleSignup(); }
  };

  return (
    <Box sx={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}>

      {/* FULL-SCREEN Slideshow */}
      {slideImages.map((src, i) => (
        <Box
          key={i}
          component="img"
          src={src}
          alt={captions[i]}
          sx={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover",
            opacity: currentSlide === i ? 1 : 0,
            transition: "opacity 1.5s ease-in-out, transform 10s ease",
            transform: currentSlide === i ? "scale(1.06)" : "scale(1)",
          }}
        />
      ))}

      {/* Soft dark overlay */}
      <Box sx={{
        position: "absolute", inset: 0, zIndex: 1,
        background: "radial-gradient(ellipse at center, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.55) 100%)",
      }} />

      {/* Page content */}
      <Box sx={{
        position: "relative", zIndex: 2,
        width: "100%", height: "100%",
        display: "flex", alignItems: "center",
        px: { xs: 2, md: 6, lg: 10 },
      }}>

        {/* LEFT — Login Card */}
        <Box sx={{
          width: "100%", maxWidth: 460,
          backgroundColor: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(24px) saturate(1.3)",
          WebkitBackdropFilter: "blur(24px) saturate(1.3)",
          borderRadius: "28px",
          border: "1px solid rgba(255,255,255,0.2)",
          boxShadow: "0 16px 60px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.2)",
          p: { xs: 4, sm: 5 },
          animation: "fadeInUp 0.6s ease-out",
        }}>
          {/* Heading */}
          <Typography sx={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.9rem", fontWeight: 800, color: "#fff",
            textAlign: "center", mb: 0.5,
            textShadow: "0 1px 6px rgba(0,0,0,0.15)",
          }}>
            {isLogin ? "Login to Your Account" : "Create Your Account"}
          </Typography>
          <Typography sx={{
            color: "rgba(255,255,255,0.5)", fontSize: "0.88rem",
            textAlign: "center", mb: 3.5,
          }}>
            {isLogin ? "Welcome back, explorer" : "Start your journey today"}
          </Typography>

          {/* Error */}
          {errors.general && (
            <Box sx={{
              p: 1.5, mb: 2.5, borderRadius: "12px",
              bgcolor: errors.general.startsWith("✅") ? "rgba(45,106,79,0.2)" : "rgba(196,69,54,0.2)",
              border: `1px solid ${errors.general.startsWith("✅") ? "rgba(140,220,170,0.3)" : "rgba(240,160,150,0.3)"}`,
            }}>
              <Typography sx={{
                fontSize: "0.85rem", fontWeight: 500, textAlign: "center",
                color: errors.general.startsWith("✅") ? "#a0e8c0" : "#f0b0a0",
              }}>
                {errors.general}
              </Typography>
            </Box>
          )}

          {/* Fields */}
          {!isLogin && (
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: "0.82rem", fontWeight: 600, mb: 0.8, ml: 0.5 }}>
                Full Name
              </Typography>
              <TextField fullWidth name="name" value={inputs.name} placeholder="John Doe"
                onChange={handleChange} onKeyDown={handleKeyDown} size="small"
                error={!!errors.name} helperText={errors.name}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px", height: 48,
                    backgroundColor: "rgba(255,255,255,0.12)", color: "#fff", fontSize: "0.95rem",
                    border: "1px solid rgba(255,255,255,0.2)",
                    "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                    "&:hover": { backgroundColor: "rgba(255,255,255,0.18)" },
                    "&.Mui-focused": { backgroundColor: "rgba(255,255,255,0.22)", border: "1px solid rgba(255,255,255,0.4)" },
                  },
                  "& .MuiInputBase-input::placeholder": { color: "rgba(255,255,255,0.3)" },
                }}
                InputProps={{ startAdornment: <InputAdornment position="start"><PersonOutlineIcon sx={{ color: "rgba(255,255,255,0.35)", fontSize: 20 }} /></InputAdornment> }}
              />
            </Box>
          )}

          <Box sx={{ mb: 2 }}>
            <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: "0.82rem", fontWeight: 600, mb: 0.8, ml: 0.5 }}>
              Email
            </Typography>
            <TextField fullWidth name="email" value={inputs.email} placeholder="you@example.com"
              onChange={handleChange} onKeyDown={handleKeyDown} size="small" type="email"
              error={!!errors.email} helperText={errors.email}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px", height: 48,
                  backgroundColor: "rgba(255,255,255,0.12)", color: "#fff", fontSize: "0.95rem",
                  border: "1px solid rgba(255,255,255,0.2)",
                  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.18)" },
                  "&.Mui-focused": { backgroundColor: "rgba(255,255,255,0.22)", border: "1px solid rgba(255,255,255,0.4)" },
                },
                "& .MuiInputBase-input::placeholder": { color: "rgba(255,255,255,0.3)" },
              }}
              InputProps={{ startAdornment: <InputAdornment position="start"><EmailOutlinedIcon sx={{ color: "rgba(255,255,255,0.35)", fontSize: 20 }} /></InputAdornment> }}
            />
          </Box>

          <Box sx={{ mb: 1 }}>
            <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: "0.82rem", fontWeight: 600, mb: 0.8, ml: 0.5 }}>
              Password
            </Typography>
            <TextField fullWidth name="password" value={inputs.password} placeholder="••••••••"
              onChange={handleChange} onKeyDown={handleKeyDown} size="small" type="password"
              error={!!errors.password} helperText={errors.password}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px", height: 48,
                  backgroundColor: "rgba(255,255,255,0.12)", color: "#fff", fontSize: "0.95rem",
                  border: "1px solid rgba(255,255,255,0.2)",
                  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.18)" },
                  "&.Mui-focused": { backgroundColor: "rgba(255,255,255,0.22)", border: "1px solid rgba(255,255,255,0.4)" },
                },
                "& .MuiInputBase-input::placeholder": { color: "rgba(255,255,255,0.3)" },
              }}
              InputProps={{ startAdornment: <InputAdornment position="start"><LockOutlinedIcon sx={{ color: "rgba(255,255,255,0.35)", fontSize: 20 }} /></InputAdornment> }}
            />
          </Box>

          {/* Submit */}
          <Button fullWidth variant="contained"
            onClick={isLogin ? handleLogin : handleSignup} disabled={loading}
            sx={{
              mt: 3, py: 1.6, borderRadius: "14px",
              fontSize: "1rem", fontWeight: 700, textTransform: "none",
              backgroundColor: "#fff", color: "#2d4a3e",
              boxShadow: "0 6px 24px rgba(0,0,0,0.15)",
              transition: "all 0.3s ease",
              "&:hover": { backgroundColor: "#f0ebe3", boxShadow: "0 8px 30px rgba(0,0,0,0.2)", transform: "translateY(-2px)" },
            }}
          >
            {loading ? (isLogin ? "Signing in..." : "Creating account...") : (isLogin ? "LOGIN" : "CREATE ACCOUNT")}
          </Button>

          {/* Toggle */}
          <Typography sx={{ mt: 3, color: "rgba(255,255,255,0.5)", fontSize: "0.88rem", textAlign: "center" }}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <Box component="span"
              onClick={() => { setIsLogin(!isLogin); setErrors({}); }}
              sx={{
                ml: 0.5, color: "#fff", fontWeight: 700, cursor: "pointer",
                textDecoration: "underline", textUnderlineOffset: "3px",
                transition: "color 0.2s", "&:hover": { color: "#c45d35" },
              }}
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </Box>
          </Typography>
        </Box>

        {/* RIGHT BOTTOM — Brand + Quote */}
        <Box sx={{
          position: "absolute", bottom: { xs: 20, md: 40 }, right: { xs: 20, md: 60 },
          textAlign: "right",
          animation: "fadeIn 1s ease-out 0.3s both",
        }}>
          {/* Inkpulse brand */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 1, mb: 1.5 }}>
            <Box sx={{
              width: 38, height: 38, borderRadius: "10px",
              backgroundColor: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(10px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "1px solid rgba(255,255,255,0.2)",
            }}>
              <Typography sx={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.2rem", fontWeight: 800, color: "#fff",
              }}>I</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "baseline" }}>
              <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 800, color: "#fff", textShadow: "0 2px 10px rgba(0,0,0,0.3)" }}>Ink</Typography>
              <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 800, color: "#c45d35", textShadow: "0 2px 10px rgba(0,0,0,0.3)" }}>pulse</Typography>
            </Box>
          </Box>

          {/* Quote */}
          <Typography sx={{
            fontFamily: "'Playfair Display', serif",
            fontSize: { xs: "1rem", md: "1.3rem" },
            fontStyle: "italic", fontWeight: 500,
            color: "rgba(255,255,255,0.6)",
            lineHeight: 1.5, maxWidth: 360,
            textShadow: "0 1px 8px rgba(0,0,0,0.2)",
          }}>
            "The world is a book, and those<br />who do not travel read only one page."
          </Typography>
          <Typography sx={{
            color: "rgba(255,255,255,0.35)", fontSize: "0.78rem",
            mt: 0.8, fontWeight: 500, letterSpacing: "0.04em",
          }}>
            — Saint Augustine
          </Typography>

          {/* Slide indicators */}
          <Box sx={{ display: "flex", gap: 0.8, justifyContent: "flex-end", mt: 2.5 }}>
            {slideImages.map((_, i) => (
              <Box key={i} onClick={() => goToSlide(i)}
                sx={{
                  width: currentSlide === i ? 24 : 7, height: 4,
                  borderRadius: 2, cursor: "pointer",
                  backgroundColor: currentSlide === i ? "#fff" : "rgba(255,255,255,0.25)",
                  transition: "all 0.4s ease",
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default AuthBox;
