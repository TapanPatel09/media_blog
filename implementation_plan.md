# Full-Stack MERN Blog Project Architecture

The goal is to establish a complete MERN stack blog application with an Express.js/MongoDB backend and a React.js (Vite) + Tailwind CSS frontend. Features include secure authentication via JWT, blog post CRUD operations with role-based restrictions, and a commenting/liking system.

## User Review Required

> [!IMPORTANT]
> - Since this is a massive boilerplate project, is it okay to instantiate the project in the current directory `c:\Users\ASUS\Desktop\temp-try-project\awd_project\andular_awd_project`? Or would you prefer a new workspace like `blog_app`?
> - The frontend will be spun up using Vite and React, styled with Tailwind CSS for a modern, responsive UI. Is that acceptable?
  
## Proposed Changes

### Backend Infrastructure (`backend/`)
We will create a structured and secure Express API containing models, controllers, and routes to handle data logic.
  
#### [NEW] `backend/server.js`
- Express setup, CORS, and connection to MongoDB with Mongoose. Mount all API routes.

#### [NEW] `backend/config/db.js`
- MongoDB connection configuration script.

#### [NEW] `backend/models/User.js`
- Schema for users (`name`, `email`, `password`) hashing passwords with `bcryptjs`.

#### [NEW] `backend/models/Blog.js`
- Schema for blog posts (`title`, `content`, `author`, `likes`).

#### [NEW] `backend/models/Comment.js`
- Schema for comments (`text`, `user`, `blog`).

#### [NEW] `backend/middleware/authMiddleware.js`
- Middleware to extract JWT from `Authorization` header and protect restricted routes.

#### [NEW] `backend/controllers/authController.js`
- Logic for user registration and login endpoints.

#### [NEW] `backend/controllers/blogController.js`
- Logic for fetching all blogs, fetching single blog, creating, updating, deleting (with owner checks), and toggling likes.

#### [NEW] `backend/controllers/commentController.js`
- Logic for adding and deleting comments conditionally based on comment owner.

---

### Frontend Infrastructure (`frontend/`)
We will replace the existing setup with a new Vite React app for building a dynamic SPA. State management will use React Context API.

#### [NEW] `frontend/package.json` & Configs
- Vite, React, standard dependencies (react-router-dom, axios).
- Tailwind CSS config for utility-first styling.

#### [NEW] `frontend/src/context/AuthContext.jsx`
- Auth state to map the currently logged-in user across the entire application and retrieve JWT from localStorage.

#### [NEW] `frontend/src/services/api.js`
- Axios instance configured to automatically attach JWT to requests if available.

#### [NEW] `frontend/src/components/Navbar.jsx`
- Responsive navigation conditionally showing Login/Register vs. Dashboard/Create/Profile based on `AuthContext`.

#### [NEW] `frontend/src/components/ProtectedRoute.jsx`
- Higher Order Component to prevent unauthorized access to specific pages like Create Blog.

#### [NEW] `frontend/src/pages/Home.jsx`
- The public landing page mapping through blogs fetched from the backend.

#### [NEW] `frontend/src/pages/BlogDetail.jsx`
- Detailed view of a single blog, listing comments and the interactive "Like" button (conditionally enabled/disabled).

#### [NEW] `frontend/src/pages/Login.jsx` & UI
- Custom user forms handling sign ins.

#### [NEW] `frontend/src/pages/Dashboard.jsx`
- Display only the authenticated user's posts, showing actions to Edit and Delete.

## Verification Plan

### Automated Tests
- Validate linting and clean console without breaking API calls.

### Manual Verification
1. Open the React frontend, browse public posts cleanly.
2. Sign up and login to interact with Create Blog button.
3. Test attempting to edit/delete a post not belonging to the currently authenticated user.
4. Interact with the comments and ensure correct behavior.
