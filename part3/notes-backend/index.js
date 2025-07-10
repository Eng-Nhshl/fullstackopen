const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())

let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
app.use(requestLogger)

// hello world page
app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

// view all notes in json format
app.get('/api/notes', (req, res) => {
  res.json(notes)
})

// view a single note with its id
app.get('/api/notes/:id', (req, res) => {
  const id = req.params.id
  const note = notes.find(n => n.id === id)
  note ?
    res.json(note)
    :
    res.status(404).end()
})

// deleting a note
app.delete('/api/notes/:id', (req, res) => {
  const id = req.params.id
  notes = notes.filter(n => n.id !== id)

  res.status(204).end()
})

const generateID = () => {
  const maxID = notes.length > 0
    ? Math.max(...notes.map(n => Number(n.id)))
    : 0

  return String(maxID + 1)
}
// create a note
app.post('/api/notes', (req, res) => {
  const body = req.body

  if (!body.content) {
    return res.status(404).json({
      error: 'content missing!'
    })
  }

  const note = {
    id: generateID(),
    content: body.content,
    important: body.important || false
  }

  notes = notes.concat(note)
  res.json(note)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})
