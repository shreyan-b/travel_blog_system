# InkPulse

InkPulse is a full-stack travel blogging platform built using the MERN stack. It enables users to create, browse, like, and comment on travel stories, while providing administrators with tools to approve posts, moderate content, and manage users. The application supports JWT-based authentication, image uploads, post search and filtering, nested comment replies, and dedicated dashboards for both users and admins.

## Features

- User authentication with JWT
- Create, edit, and delete blog posts
- Image upload support
- Search, filter, and sort posts
- Like and comment on posts
- Nested comment replies
- Personal dashboard for your own posts
- Admin dashboard for post approval and user management
- Responsive UI built with React and Material UI

## Tech Stack

- Frontend: React, Vite, React Router, Material UI, Axios
- Backend: Node.js, Express.js
- Database: MongoDB, Mongoose
- Authentication: JWT, bcrypt
- File Uploads: multer

## Project Structure

```bash
travel_blog_system/
├── client/      # React frontend
└── server/      # Express backend
```

## Getting Started

### Prerequisites

- Node.js
- MongoDB
- npm

### Installation

```bash
git clone https://github.com/shreyan-b/travel_blog_system.git
cd travel_blog_system
```

### Install frontend dependencies

```bash
cd client
npm install
```

### Install backend dependencies

```bash
cd ../server
npm install
```

## Environment Variables

Create a `.env` file inside the `server` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

## Run the app

### Start backend

```bash
cd server
npm start
```

### Start frontend

```bash
cd client
npm run dev
```

## API Endpoints

### Auth

- `POST /api/auth/signup`
- `POST /api/auth/login`

### User

- `GET /api/user/profile`

### Posts

- `GET /api/posts`
- `GET /api/posts/:id`
- `POST /api/posts`
- `PUT /api/posts/:id`
- `DELETE /api/posts/:id`
- `GET /api/posts/my-posts`
- `POST /api/posts/upload-image`

### Likes

- `POST /api/likes/:blogId`
- `GET /api/likes/:blogId/status`
- `GET /api/likes/:blogId/count`

### Comments

- `GET /api/comments/:blogId`
- `POST /api/comments/:blogId`
- `DELETE /api/comments/:commentId`

### Admin

- `GET /api/admin/stats`
- `GET /api/admin/posts/pending`
- `GET /api/admin/posts/approved`
- `PUT /api/admin/posts/:id/approve`
- `PUT /api/admin/posts/:id/reject`
- `DELETE /api/admin/posts/:id`
- `GET /api/admin/users`
- `PUT /api/admin/users/:id/suspend`
- `PUT /api/admin/users/:id/unsuspend`
- `DELETE /api/admin/users/:id`

## Notes

- Posts created by users start as pending
- Admin approval is required before posts appear publicly
- Uploaded images are served from `/uploads`
- Comments support replies
