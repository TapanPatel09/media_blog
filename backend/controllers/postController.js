const Post = require('../models/Post');
const Comment = require('../models/Comment');

exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('author', 'username').sort('-createdAt');
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'username')
            .populate('likes', 'username');
        if (!post) return res.status(404).json({ message: 'Post not found' });
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createPost = async (req, res) => {
    try {
        const { title, content } = req.body;
        const post = await Post.create({
            title,
            content,
            author: req.user._id
        });
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updatePost = async (req, res) => {
    try {
        let post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });
        
        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized to update this post' });
        }

        post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized to delete this post' });
        }

        await Comment.deleteMany({ post: post._id }); // cleanup comments
        await post.deleteOne();
        res.json({ message: 'Post removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        if (post.likes.includes(req.user._id)) {
            post.likes = post.likes.filter(id => id.toString() !== req.user._id.toString());
        } else {
            post.likes.push(req.user._id);
        }
        
        await post.save();
        res.json(post.likes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
