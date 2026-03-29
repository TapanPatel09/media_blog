const express = require('express');
const router = express.Router();
const { getBlogs, getBlogById, createBlog, updateBlog, deleteBlog, toggleLike } = require('../controllers/blogController');
const { addComment, deleteComment, getComments } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
    .get(getBlogs)
    .post(protect, upload.fields([{ name: 'photo', maxCount: 1 }, { name: 'video', maxCount: 1 }]), createBlog);

router.route('/:id')
    .get(getBlogById)
    .put(protect, upload.fields([{ name: 'photo', maxCount: 1 }, { name: 'video', maxCount: 1 }]), updateBlog)
    .delete(protect, deleteBlog);

router.post('/:id/like', protect, toggleLike);

// Comment routes attached to blogs
router.post('/:id/comment', protect, addComment);
router.get('/:id/comments', getComments);

module.exports = router;
