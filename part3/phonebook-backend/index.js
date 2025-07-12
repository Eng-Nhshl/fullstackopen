require('dotenv').config()
const express = require('express')
const Person = require('./models/person')
const morgan = require('morgan')
const app = express()


app.use(express.static('dist'))
app.use(express.json())

morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}


// info page
app.get('/info', (req, res) => {
  Person.find({}).then(people => {
    const count = people.length
    const date = new Date()
    res.send(`
      <div>
        <h1>Phonebook has info for ${count} people</h1>
        <p>${date}</p>
      </div>
    `)
  })
})


// get all persons in json format
app.get('/api/persons', (req, res, next) => {
  Person.find({}).then(person =>
    res.json(person))
    .catch(e => next(e))
})

// get a single person
app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id).then(person => {
    person ?
      res.json(person)
      :
      res.status(404).end()
  })
    .catch(e => next(e))
})

// create a person
app.post('/api/persons', (req, res, next) => {
  const body = req.body

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    res.json(savedPerson)
  })
    .catch(e => next(e))
})

// delete a person
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => res.status(204).end())
    .catch(e => next(e))
})

// updating person
app.put('/api/persons/:id', (req, res, next) => {
  const { number } = req.body

  Person.findByIdAndUpdate(
    req.params.id,
    { number },
    {
      new: true,
      runValidators: true,
      context: 'query'
    })
    .then(person => {
      if (!person) return res.status(404).end()

      person.number = number

      return person.save().then(updatedPerson =>
        res.json(updatedPerson)
      )
    })
    .catch(error => next(error))
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})