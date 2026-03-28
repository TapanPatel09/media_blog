const express = require('express');
const router = express.Router();
const { getPosts, getPost, createPost, updatePost, deletePost, likePost } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(getPosts)
    .post(protect, createPost);

router.route('/:id')
    .get(getPost)
    .put(protect, updatePost)
    .delete(protect, deletePost);

router.post('/:id/like', protect, likePost);

module.exports = router;
