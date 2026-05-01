import React, { useState, useContext } from "react";
import { API, getImageUrl } from "../service/api";
import FileUpload from "../components/FileUpload";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./PostCreate.css";

const categories = [
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

const CreatePost = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext); // Access user context to get token
  const urlParams = new URLSearchParams(location.search);
  const initialCategory = urlParams.get("category") || "Adventure";

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: initialCategory === "All" ? "Adventure" : initialCategory,
    imageUrl: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const form = new FormData();
    form.append("image", file);

    try {
      const response = await API.uploadImage(form, user.token);
      console.log("Uploaded Image URL:", response.imageUrl);
      setFormData({ ...formData, imageUrl: response.imageUrl });
    } catch (error) {
      console.error("Image upload failed:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!user?.token) {
        throw new Error("User not authenticated");
      }
      const newPost = await API.createPost(formData, user.token);
      setSubmitted(true);
      // Navigate after a short delay to show the message
      setTimeout(() => {
        navigate("/home", { state: { newPost } });
      }, 2000);
    } catch (error) {
      console.error("Create post failed:", error);
    }
  };

  if (submitted) {
    return (
      <div className="post-form" style={{ textAlign: "center", paddingTop: "80px" }}>
        <div style={{
          padding: "30px",
          backgroundColor: "#fff3e0",
          borderRadius: "12px",
          border: "2px solid #ffcc80",
        }}>
          <h2 style={{ color: "#e65100", marginBottom: "10px" }}>📝 Post Submitted!</h2>
          <p style={{ fontSize: "1.1rem", color: "#555" }}>
            Your post is under review and will be visible once approved by an admin.
          </p>
          <p style={{ fontSize: "0.9rem", color: "#888", marginTop: "10px" }}>
            Redirecting to home...
          </p>
        </div>
      </div>
    );
  }

  return (
  
    <div className="post-form">
      <input
        className="post-title"
        type="text"
        name="title"
        onChange={handleChange}
        value={formData.title}
        placeholder="Title"
      />
      <textarea
        className="post-content"
        name="content"
        onChange={handleChange}
        value={formData.content}
        placeholder="Content"
      />
      <select
        className="post-category"
        name="category"
        onChange={handleChange}
        value={formData.category}
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <div className="actions-container">
        <FileUpload onFileChange={handleFileChange} />
        <button className="submit-btn" onClick={handleSubmit}>
          Create Post
        </button>
      </div>

      {formData.imageUrl && (
        <img
          src={getImageUrl(formData.imageUrl)}
          alt="preview"
          className="post-image-preview"
        />
      )}
    </div>
  );
};

export default CreatePost;
