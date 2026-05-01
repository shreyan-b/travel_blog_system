import React, { useState, useEffect } from "react";
import { API, getImageUrl } from "../service/api";
import { useNavigate } from "react-router-dom";
import "./PostList.css"; // optional styling file

const categories = [
  "All",
  "Adventure",
  "Food",
  "Culture",
  "Nature",
  "City",
  "Technology",
  "Lifestyle",
  "Travel",
  "Health",
  "Science",
  "Education",
  "Business",
  "Entertainment",
  "Sports",
  "Art",
  "Finance",
  "Fashion",
  "Photography",
];

const PostList = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const categoryQuery = selectedCategory === "All" ? "" : `?category=${selectedCategory}`;
    API.getPosts(categoryQuery).then(setPosts);
  }, [selectedCategory]);

  return (
    <div className="post-list-container">
      <div className="category-filter">
        <label htmlFor="category-select">Filter by category: </label>
        <select
          id="category-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="post-list">
        {posts.length === 0 && <p>No posts found</p>}

        {posts.map((post) => (
          <div
            key={post._id}
            className="post-card"
            onClick={() => navigate(`/posts/${post._id}`)}
            style={{ cursor: "pointer" }}
          >
            <h2 className="post-title">{post.title}</h2>
            <p className="post-meta"><strong>Category:</strong> {post.category} | <strong>Author:</strong> {post.author?.username || "Unknown"}</p>
            {post.imageUrl && <img src={getImageUrl(post.imageUrl)} alt={post.title} className="post-image" />}
            <p className="post-snippet">{post.content.slice(0, 150)}...</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostList;
