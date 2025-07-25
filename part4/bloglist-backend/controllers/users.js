const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const { passwordValidation, usernameValidation } = require('../utils/validators')

usersRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1, likes: 1 })
  res.json(users)
})

usersRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body

  if (!usernameValidation.test(username)) {
    return res.status(400).json({
      error: 'Username contains invalid characters!',
    })
  }

  if (!password || password.length < 8) {
    return res.status(400).json({
      error: 'Password must be at least 8 characters long!'
    })
  }

  if (!passwordValidation.test(password)) {
    return res.status(400).json({
      error: 'Password must contain at least one [uppercase, lowercase, digit], and special character!'
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