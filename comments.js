// Create web server with express
// Create route to get all comments
// Create route to get comments by id
// Create route to add comment
// Create route to update comment
// Create route to delete comment
// Export router

const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');

// GET ALL COMMENTS
router.get('/', async (req, res) => {
    try {
        const comments = await Comment.find();
        res.json(comments);
    } catch (err) {
        res.json({ message: err });
    }
});

// GET COMMENT BY ID
router.get('/:commentId', async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        res.json(comment);
    } catch (err) {
        res.json({ message: err });
    }
});