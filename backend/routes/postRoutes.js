import express from 'express'
import mongoose from 'mongoose'
import Post from '../models/Post.js'
import User from '../models/User.js'

const router = express.Router()

// POST /api/posts – create a post linked to an existing user
router.post('/', async (req, res) => {
  try {
    const { title, content, userId } = req.body
    if (!title?.trim() || !content?.trim() || !userId) {
      return res.status(400).json({ message: 'Title, content and user are required.' })
    }
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: 'Invalid user ID.' })
    }

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: 'Selected user was not found.' })
    }

    const post = await Post.create({ title, content, user: user._id })
    const populatedPost = await Post.findById(post._id).populate('user', 'name email')
    return res.status(201).json({ message: 'Post created successfully.', post: populatedPost })
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message })
    }
    return res.status(500).json({ message: 'Could not create post.', error: error.message })
  }
})

// GET /api/posts – retrieve posts with related user data populated
router.get('/', async (_req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
    return res.json(posts)
  } catch (error) {
    return res.status(500).json({ message: 'Could not retrieve posts.', error: error.message })
  }
})

export default router
