import express from 'express';
import cors from "cors";
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';
import userRoutes from './routes/user.js';
import likeRoutes from './routes/likes.js';
import commentRoutes from './routes/comments.js';
import adminRoutes from './routes/admin.js';
import path from "path";
import fs from "fs";

dotenv.config();

// Ensure uploads directory exists (Railway has ephemeral filesystem)
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const app = express();   // ✅ Create app first

// Disable ETag to prevent 304 responses on Railway
app.set('etag', false);

// ✅ Use middleware AFTER creating app
app.use(cors({
  origin: "*"
}));

app.use(express.json());

// Prevent caching on API routes
app.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/user', userRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/admin', adminRoutes);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Test route
app.get('/', (req, res) => {
  res.send("Welcome to InkPulse API");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
