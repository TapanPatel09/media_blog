const Comment = require('../models/Comment');
const Blog = require('../models/Blog');

// @desc    Add a comment
// @route   POST /api/blogs/:id/comment
// @access  Private
const addComment = async (req, res) => {
    try {
        const { text } = req.body;
        const blogId = req.params.id;

        if (!text) {
            return res.status(400).json({ message: 'Please add comment text' });
        }

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        const comment = await Comment.create({
            text,
            user: req.user.id,
            blog: blogId
        });

        const newComment = await Comment.findById(comment._id).populate('user', 'name');

        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get comments for a blog
// @route   GET /api/blogs/:id/comments
// @access  Public
const getComments = async (req, res) => {
    try {
        const comments = await Comment.find({ blog: req.params.id })
            .populate('user', 'name')
            .sort({ createdAt: -1 });
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Check ownership
        if (comment.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized to delete this comment' });
        }

        await comment.deleteOne();

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addComment,
    getComments,
    deleteComment
};
