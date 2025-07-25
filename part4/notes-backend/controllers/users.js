const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const { isStrongPassword } = require('../utils/validators')


usersRouter.get('/', async (req, res) => {
  const users = await User
    .find({}).populate('notes', { content: 1, important: 1 })

  res.json(users)
})

usersRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body

  if (!password || password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' })
  }

  if (!isStrongPassword(password)) {
    return res.status(400).json({
      error: 'Password must include uppercase, lowercase, number, and special character'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash
  })

  const savedUser = await user.save()

  res.status(201).json(savedUser)
})

module.exports = usersRouter
