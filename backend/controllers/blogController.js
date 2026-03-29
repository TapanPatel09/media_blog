const Blog = require('../models/Blog');

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
const getBlogs = async (req, res) => {
    try {
        // Optional pagination logic
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const blogs = await Blog.find()
            .populate('author', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        
        const total = await Blog.countDocuments();

        res.status(200).json({
            blogs,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single blog
// @route   GET /api/blogs/:id
// @access  Public
const getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate('author', 'name email');
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a blog
// @route   POST /api/blogs
// @access  Private
const createBlog = async (req, res) => {
    try {
        if (!req.body.title || !req.body.content) {
            return res.status(400).json({ message: 'Please add a text and content field' });
        }

        let photoUrl = '';
        let videoUrl = '';

        if (req.files) {
            if (req.files.photo && req.files.photo.length > 0) {
                photoUrl = '/uploads/' + req.files.photo[0].filename;
            }
            if (req.files.video && req.files.video.length > 0) {
                videoUrl = '/uploads/' + req.files.video[0].filename;
            }
        }

        const blog = await Blog.create({
            title: req.body.title,
            content: req.body.content,
            author: req.user.id,
            photoUrl,
            videoUrl
        });

        res.status(201).json(blog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private
const updateBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // Check for user ownership
        if (blog.author.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized to update this blog' });
        }

        let updateData = { ...req.body };

        if (req.files) {
            if (req.files.photo && req.files.photo.length > 0) {
                updateData.photoUrl = '/uploads/' + req.files.photo[0].filename;
            }
            if (req.files.video && req.files.video.length > 0) {
                updateData.videoUrl = '/uploads/' + req.files.video[0].filename;
            }
        }

        const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
        });

        res.status(200).json(updatedBlog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private
const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // Check for user ownership
        if (blog.author.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized to delete this blog' });
        }

        await blog.deleteOne();

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Toggle Like on a blog
// @route   POST /api/blogs/:id/like
// @access  Private
const toggleLike = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // Check if already liked
        const isLiked = blog.likes.includes(req.user.id);

        if (isLiked) {
            // Unlike
            blog.likes = blog.likes.filter((userId) => userId.toString() !== req.user.id);
        } else {
            // Like
            blog.likes.push(req.user.id);
        }

        await blog.save();

        res.status(200).json(blog.likes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getBlogs,
    getBlogById,
    createBlog,
    updateBlog,
    deleteBlog,
    toggleLike
};
