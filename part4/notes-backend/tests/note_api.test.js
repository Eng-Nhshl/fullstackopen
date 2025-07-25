const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const helper = require('./test_helper')
const Note = require('../models/note')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const api = supertest(app)

describe('when there is initially some notes saved', () => {
  beforeEach(async () => {
    await Note.deleteMany({})
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('Sekret1!', 10)
    const user = new User({ username: 'testuser', passwordHash })
    await user.save()

    const notesWithUser = helper.initialNotes.map(n => ({ ...n, user: user._id }))
    await Note.insertMany(notesWithUser)
  })

  test('notes are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all notes are returned', async () => {
    const response = await api.get('/api/notes')

    assert.strictEqual(response.body.length, helper.initialNotes.length)
  })

  test('a specific note is within the returned notes', async () => {
    const response = await api.get('/api/notes')

    const contents = response.body.map(e => e.content)
    assert(contents.includes('HTML is easy'))
  })

  describe('viewing a specific note', () => {
    test('succeeds with a valid id', async () => {
      const notesAtStart = await helper.notesInDb()
      const noteToView = notesAtStart[0]

      const resultNote = await api
        .get(`/api/notes/${noteToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(resultNote.body.id, noteToView.id)
      assert.strictEqual(resultNote.body.content, noteToView.content)
      assert.strictEqual(resultNote.body.important, noteToView.important)
      assert.strictEqual(resultNote.body.date, noteToView.date)
    })

    test('fails with statuscode 404 if note does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId()

      await api.get(`/api/notes/${validNonexistingId}`).expect(404)
    })

    test('fails with statuscode 400 id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'

      await api.get(`/api/notes/${invalidId}`).expect(400)
    })
  })

  describe('addition of a new note', () => {
    test('succeeds with valid data', async () => {
      let users = await User.find({})
      if (users.length === 0) {
        // Create a fallback user if none exist yet (tests may run in any order)
        const passwordHash = await bcrypt.hash('Test123!', 10)
        const user = new User({ username: 'tempuser', passwordHash })
        await user.save()
        users = [user]
      }
      const userId = users[0]._id.toString() // extract the ID as string


      const newNote = {
        content: 'async/await simplifies making async calls',
        important: true,
        userId: userId
      }

      await api
        .post('/api/notes')
        .send(newNote)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const notesAtEnd = await helper.notesInDb()
      assert.strictEqual(notesAtEnd.length, helper.initialNotes.length + 1)

      const contents = notesAtEnd.map(n => n.content)
      assert(contents.includes('async/await simplifies making async calls'))
    })


    test('fails with status code 400 if data invalid', async () => {
      const newNote = { important: true }

      await api.post('/api/notes').send(newNote).expect(400)

      const notesAtEnd = await helper.notesInDb()

      assert.strictEqual(notesAtEnd.length, helper.initialNotes.length)
    })
  })

  describe('updating a note', () => {
    test('succeeds with valid data and id', async () => {
      const notesAtStart = await helper.notesInDb()
      const noteToUpdate = notesAtStart[0]

      const updatedData = {
        important: !noteToUpdate.important,
      }

      const response = await api
        .put(`/api/notes/${noteToUpdate.id}`)
        .send(updatedData)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.important, updatedData.important)

      const notesAtEnd = await helper.notesInDb()
      const updatedNote = notesAtEnd.find(note => note.id === noteToUpdate.id)

      assert.strictEqual(updatedNote.important, updatedData.important)
    })

    test('fails with status 404 if note does not exist', async () => {
      const nonExistingId = await helper.nonExistingId()

      const updatedData = {
        important: true,
      }

      await api
        .put(`/api/notes/${nonExistingId}`)
        .send(updatedData)
        .expect(404)
    })

    test('fails with status 400 if id is invalid', async () => {
      const invalidId = 'invalid-id-123'

      const updatedData = {
        important: false,
      }

      await api
        .put(`/api/notes/${invalidId}`)
        .send(updatedData)
        .expect(400)
    })
  })

  describe('deletion of a note', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const notesAtStart = await helper.notesInDb()
      const noteToDelete = notesAtStart[0]

      await api.delete(`/api/notes/${noteToDelete.id}`).expect(204)

      const notesAtEnd = await helper.notesInDb()

      const contents = notesAtEnd.map(n => n.content)
      assert(!contents.includes(noteToDelete.content))

      assert.strictEqual(notesAtEnd.length, helper.initialNotes.length - 1)
    })
  })
})

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('Sekret1!', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  describe('user creation validation', () => {

    test('creation succeeds with a fresh username', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'mluukkia',
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

    test('fails if username too short', async () => {
      const newUser = {
        username: 'ab',
        name: 'Tiny',
        password: 'Goodpass1!'
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

      assert(result.body.error.includes('is shorter than'))
    })

    test('fails if username has invalid chars', async () => {
      const newUser = {
        username: 'john-doe',
        name: 'John',
        password: 'Goodpass1!'
      }

      await api.post('/api/users').send(newUser).expect(400)
    })


    test('creation fails with proper statuscode and message if username already taken', async () => {
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
    })

  })

})

after(async () => {
  await mongoose.connection.close()
})
