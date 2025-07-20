const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({})
  res.json(blogs)
})

blogsRouter.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id)
  blog
    ? res.json(blog)
    : res.status(404).end()
})

blogsRouter.post('/', async (req, res) => {
  const body = req.body

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  })

  const savedBlog = await blog.save()
  res.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (req, res) => {
  const blogToDelete = await Blog.findByIdAndDelete(req.params.id)
  !blogToDelete
    ? res.status(404).end()
    : res.status(204).end()
})

blogsRouter.put('/:id', async (req, res) => {
  const { likes } = req.body

  const blog = await Blog.findByIdAndUpdate(req.params.id)

  if (!blog) {
    return res.status(404).end()
  }

  blog.likes = likes

  const updatedBlog = await blog.save()
  res.json(updatedBlog)
})

module.exports = blogsRouter