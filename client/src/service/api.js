import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Backend root URL for serving static files (uploads)
const BACKEND_URL = BASE_URL.replace(/\/api$/, '');

export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return '';
  if (imageUrl.startsWith('http')) return imageUrl; // already absolute
  return `${BACKEND_URL}${imageUrl}`;
};

const authHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const API = {
  // ============ AUTH ============
  authenticateLogin: (loginData) =>
    axios.post(`${BASE_URL}/auth/login`, loginData).then((res) => res.data),

  userSignup: (signupData) =>
    axios.post(`${BASE_URL}/auth/signup`, signupData).then((res) => res.data),

  getUserProfile: (token) =>
    axios
      .get(`${BASE_URL}/user/profile`, authHeaders(token))
      .then((res) => res.data),

  // ============ POSTS ============
  getPosts: (queryString = "") =>
    axios.get(`${BASE_URL}/posts${queryString}`).then((res) => res.data),

  getMyPosts: (token) =>
    axios.get(`${BASE_URL}/posts/my-posts`, authHeaders(token)).then((res) => res.data),

  uploadImage: (formData, token) =>
    axios
      .post(`${BASE_URL}/posts/upload-image`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => res.data),

  createPost: (postData, token) =>
    axios
      .post(`${BASE_URL}/posts`, postData, authHeaders(token))
      .then((res) => res.data),

  getPostById: (postId) =>
    axios.get(`${BASE_URL}/posts/${postId}`).then((res) => res.data),

  deletePost: async (postId, token) => {
    const response = await axios.delete(`${BASE_URL}/posts/${postId}`, authHeaders(token));
    return response.data;
  },

  updatePost: (postId, postData, token) =>
    axios
      .put(`${BASE_URL}/posts/${postId}`, postData, authHeaders(token))
      .then((res) => res.data),

  // ============ LIKES ============
  toggleLike: (blogId, token) =>
    axios.post(`${BASE_URL}/likes/${blogId}`, {}, authHeaders(token)).then((res) => res.data),

  getLikeStatus: (blogId, token) =>
    axios.get(`${BASE_URL}/likes/${blogId}/status`, authHeaders(token)).then((res) => res.data),

  getLikeCount: (blogId) =>
    axios.get(`${BASE_URL}/likes/${blogId}/count`).then((res) => res.data),

  // ============ COMMENTS ============
  getComments: (blogId) =>
    axios.get(`${BASE_URL}/comments/${blogId}`).then((res) => res.data),

  addComment: (blogId, data, token) =>
    axios.post(`${BASE_URL}/comments/${blogId}`, data, authHeaders(token)).then((res) => res.data),

  deleteComment: (commentId, token) =>
    axios.delete(`${BASE_URL}/comments/${commentId}`, authHeaders(token)).then((res) => res.data),

  // ============ ADMIN ============
  getAdminStats: (token) =>
    axios.get(`${BASE_URL}/admin/stats`, authHeaders(token)).then((res) => res.data),

  getPendingPosts: (token) =>
    axios.get(`${BASE_URL}/admin/posts/pending`, authHeaders(token)).then((res) => res.data),

  getApprovedPosts: (token) =>
    axios.get(`${BASE_URL}/admin/posts/approved`, authHeaders(token)).then((res) => res.data),

  approvePost: (postId, token) =>
    axios.put(`${BASE_URL}/admin/posts/${postId}/approve`, {}, authHeaders(token)).then((res) => res.data),

  rejectPost: (postId, token) =>
    axios.put(`${BASE_URL}/admin/posts/${postId}/reject`, {}, authHeaders(token)).then((res) => res.data),

  adminDeletePost: (postId, token) =>
    axios.delete(`${BASE_URL}/admin/posts/${postId}`, authHeaders(token)).then((res) => res.data),

  getAllUsers: (token) =>
    axios.get(`${BASE_URL}/admin/users`, authHeaders(token)).then((res) => res.data),

  suspendUser: (userId, token) =>
    axios.put(`${BASE_URL}/admin/users/${userId}/suspend`, {}, authHeaders(token)).then((res) => res.data),

  unsuspendUser: (userId, token) =>
    axios.put(`${BASE_URL}/admin/users/${userId}/unsuspend`, {}, authHeaders(token)).then((res) => res.data),

  deleteUser: (userId, token) =>
    axios.delete(`${BASE_URL}/admin/users/${userId}`, authHeaders(token)).then((res) => res.data),
};
