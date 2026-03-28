const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, 'Please add some text']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    blog: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Blog'
    }
}, {
    timestamps: true
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
