const express = require('express')
const morgan = require('morgan')

const app = express()
morgan.token('body', function (req, res) { return req.method === 'POST' ? JSON.stringify(req.body) : '' })
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456'
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523'
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345'
  },
  {
    id: 4,
    name: 'Mary Poppendick',
    number: '39-23-6423122'
  }
]

const generateId = () => {
  let id = undefined
  while (!id || persons.find(p => p.id === id)) {
    id = Math.ceil(Math.random() * 10000)
  }
  return id
}

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.post('/api/persons', (request, response) => {
  const person = request.body
  if (!person.name || !person.number) {
    return response.status(400).json({
      error: 'Both name and number must be included'
    })
  }
  if (persons.find(p => p.name === person.name)) {
    return response.status(400).json({
      error: 'Name must be unique'
    })
  }

  person.id = generateId()
  persons = persons.concat(person)
  response.json(person)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(p => p.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(p => p.id !== id)

  response.status(204).end()
})

app.get('/info', (request, response) => {
  response.send(`<div>Phonebook has info for ${persons.length} people</div><div>${new Date()}</div>`)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})