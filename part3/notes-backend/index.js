require('dotenv').config()
const express = require('express')
const Note = require('./models/note')
const app = express()

let notes = []

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(requestLogger)
app.use(express.static('dist'))
app.use(express.json())

// hello world page
app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

// view all notes in json format
app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

// view a single note with its id
app.get('/api/notes/:id', (req, res) => {
  Note.findById(req.params.id).then(note => {
    res.json(note)
  })
})

// create a note
app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ error: 'content missing' })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save().then(savedNote => {
    response.json(savedNote)
  })
})

// deleting a note
app.delete('/api/notes/:id', (req, res) => {
  const id = req.params.id
  notes = notes.filter(n => n.id !== id)

  res.status(204).end()
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})
