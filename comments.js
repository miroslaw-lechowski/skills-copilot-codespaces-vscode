// Create web server with express
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { randomBytes } = require('crypto');
const axios = require('axios');

// Create an express app
const app = express();

// Use cors
app.use(cors());
// Use body-parser
app.use(bodyParser.json());

// Create comments object
const commentsByPostId = {};

// Create get route
app.get('/posts/:id/comments', (req, res) => {
  // Send commentsByPostId object
  res.send(commentsByPostId[req.params.id] || []);
});

// Create post route
app.post('/posts/:id/comments', async (req, res) => {
  // Create id
  const commentId = randomBytes(4).toString('hex');

  // Get content from request body
  const { content } = req.body;

  // Get comments from commentsByPostId object
  const comments = commentsByPostId[req.params.id] || [];

  // Push new comment to comments array
  comments.push({ id: commentId, content, status: 'pending' });

  // Set comments object
  commentsByPostId[req.params.id] = comments;

  // Send comment object
  await axios.post('http://localhost:4005/events', {
    type: 'CommentCreated',
    data: { id: commentId, content, postId: req.params.id, status: 'pending' },
  });

  // Send comments array
  res.status(201).send(comments);
});

// Create post route
app.post('/events', async (req, res) => {
  // Get type and data from request body
  const { type, data } = req.body;

  // Check type
  if (type === 'CommentModerated') {
    // Get comment from commentsByPostId object
    const { id, postId, status, content } = data;

    // Get comments from commentsByPostId object
    const comments = commentsByPostId[postId];

    // Get comment from comments array
    const comment = comments.find((comment) => comment.id === id);

    // Set status
    comment.status = status;

    // Send comment object
    await axios.post('http://localhost:4005/events', {
      type: 'CommentUpdated',
      data: { id, postId, status, content