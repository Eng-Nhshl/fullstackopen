const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'Can\'t hurt me',
    author: 'David Goggins',
    url: 'http://localhost.com',
    likes: 40
  },
  {
    title: 'Testing the Backend with supertest',
    author: 'Eng-Nhshl',
    url: 'http://localhost.com',
    likes: 20
  }
]

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'Temporary blog',
    author: 'Temp Author',
    url: 'http://temp.url',
    likes: 0,
  })

  await blog.save()
  await blog.deleteOne()
  return blog._id.toString()
}


const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb, usersInDb
}