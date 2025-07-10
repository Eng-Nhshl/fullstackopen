const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())

let persons = [
  {
    "id": "1",
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": "2",
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": "3",
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": "4",
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(`:method :url :status :res[content-length] - :response-time ms :body`))

// info page
app.get('/info', (req, res) => {
  const info = persons.length
  const date = Date()
  res.send(`
    <div>
      <h1>Phonebook has info for ${info} People</h1>
      <p>${date}</p>
    </div>
    `)
})

// get all persons in json format
app.get('/api/persons', (req, res) => {
  res.json(persons)
})

// get a single person
app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id
  const person = persons.find(p => p.id === id)
  person ?
    res.json(person)
    :
    res.status(404).end()
})

// delete a person
app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id
  persons = persons.filter(p => p.id !== id)
  res.status(204).end()
})


const generateID = () => {
  const maxID = persons.length > 0
    ? Math.max(...persons.map(p => Number(p.id)))
    : 0
  return String(maxID + 1)
}

// create a person
app.post('/api/persons', (req, res) => {
  const body = req.body
  const nameExists = persons.some(p => p.name === body.name)

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number missing'
    })
  }


  if (nameExists) {
    return res.status(201).json({
      error: 'Name must be unique!'
    })
  }

  const person = {
    id: generateID(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)

  res.json(person)
})

const PORT = 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})