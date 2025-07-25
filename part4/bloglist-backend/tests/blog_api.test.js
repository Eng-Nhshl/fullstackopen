const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const api = supertest(app)

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })


  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('a specific blog within the returned blogs', async () => {
    const response = await api.get('/api/blogs')

    const titles = response.body.map(t => t.title)
    assert(titles.includes('Can\'t hurt me'))
  })

  describe('viewing a specific blog', () => {
    test('succeeds with a valid id', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToView = blogsAtStart[0]

      const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.deepStrictEqual(resultBlog.body, blogToView)
    })

    test('fails with statuscode 404 if blog does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId()

      await api.get(`/api/blogs/${validNonexistingId}`).expect(404)
    })
  })

  describe('addition of a new blog', () => {
    test('succeeds with valid data', async () => {
      const passwordHash = await bcrypt.hash('TemporaryUser', 10)
      const user = new User({ username: 'TempUser', passwordHash })

      await user.save()

      const newBlog = {
        title: 'Think again',
        author: 'Ali Zayed',
        url: 'https://localhost.net',
        likes: 20,
        userId: user._id
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

      const titles = blogsAtEnd.map(t => t.title)
      assert(titles.includes('Think again'))
    })

    test('fails with status 400 if url is missing', async () => {
      const newBlog = {
        title: 'Node.JS',
        author: 'Node',
        likes: 2
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('fails with status 400 if title is missing', async () => {
      const newBlog = {
        author: 'Node',
        url: 'http:localhost.com',
        likes: 2
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
  })

  describe('updating a blog', () => {
    test('succeeds with valid data and id', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      const updatedData = {
        likes: 22
      }

      const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedData)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.likes, updatedData.likes)

      const blogsAtEnd = await helper.blogsInDb()
      const updatedblog = blogsAtEnd.find(blog => blog.id === blogToUpdate.id)

      assert.strictEqual(updatedblog.likes, updatedData.likes)
    })

    test('fails with status 404 if blog does not exist', async () => {
      const nonExistingId = await helper.nonExistingId()

      const updatedData = {
        title: 'Temporary blog',
        author: 'Temp Author',
        url: 'http://temp.url',
        likes: 0,
      }

      await api
        .put(`/api/blogs/${nonExistingId}`)
        .send(updatedData)
        .expect(404)
    })

    test('fails with status 400 if id is invalid', async () => {
      const invalidId = 'invalid-id-123'

      const updatedData = {
        title: 'Temporary blog',
        author: 'Temp Author',
        url: 'http://temp.url',
        likes: 0,
      }

      await api
        .put(`/api/blogs/${invalidId}`)
        .send(updatedData)
        .expect(400)
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      const titles = blogsAtEnd.map(t => t.title)
      assert(!titles.includes(blogToDelete.title))

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    })
  })
})

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  describe('creation of user', () => {
    test('creation succeeds with a fresh username', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'Salainen1!'
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

      const usernames = usersAtEnd.map(u => u.username)
      assert(usernames.includes(newUser.username))
    })

    test('creation fails with proper statuscode and message if username already taken',
      async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
          username: 'root',
          name: 'Superuser',
          password: 'Salainen1!'
        }

        const result = await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
          .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('expected `username` to be unique'))

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
      }
    )

    test('creation fails with invalid characters in username', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'bad$%&user',
        name: 'Invalid Chars User',
        password: 'strongPassword!'
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()

      assert(result.body.error.includes('Username contains invalid characters!'))

      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('creation fails with weak password', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'randomuser',
        name: 'Weak Password',
        password: 'abd123'
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert(
        result.body.error.includes('Password must be at least 8 characters long!') ||
        result.body.error.includes('Password must contain at least one [uppercase, lowercase, digit], and special character!')
      )

      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})