import express from 'express'
import User from '../models/User.js'

const router = express.Router()

// POST /api/users – create a user
router.post('/', async (req, res) => {
  try {
    const { name, email } = req.body
    if (!name?.trim() || !email?.trim()) {
      return res.status(400).json({ message: 'Name and email are required.' })
    }

    const user = await User.create({ name, email })
    return res.status(201).json({ message: 'User created successfully.', user })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'This email is already registered.' })
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message })
    }
    return res.status(500).json({ message: 'Could not create user.', error: error.message })
  }
})

// GET /api/users – list users (used by the post author dropdown)
router.get('/', async (_req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 })
    return res.json(users)
  } catch (error) {
    return res.status(500).json({ message: 'Could not retrieve users.', error: error.message })
  }
})

export default router
