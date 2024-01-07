const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const path = require('path')
const PORT = process.env.PORT || 3001
const Person = require('./models/person')
app.use(cors())
app.use(express.static(path.join(__dirname, 'dist')))
app.use(express.json())
//const dirnames = path.join(__dirname, 'dist')

let phonebook = [
  {id: 1, name:'Lucas', number:'1134700227' },
  {id: 2, name:'Enzo', number:'12345678' },
  {id: 3, name:'Leo', number:'919192390' },
];

morgan.token('postData', (req) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
  return ''
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'))

app.get('/info',(request,response) => {
  const now = new Date()
  response.send(
    `<p>Phonebook has info for ${phonebook.length} people</p> <p>${now}</p>`
  )
})

app.get('/api/persons',(request,response,next) => {
  Person.find({})
    .then(persons => {
      response.json(persons)
    })
    .catch(error => next(error))
    // response.json(phonebook);
})

app.get('/api/persons/:id',(request,response,next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response,next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})


// const getRandomId = ()=>{
//     const min = 1;
//     const max = 100;
//     const randomInteger = Math.floor(Math.random() * (max - min + 1)) + min;
//     return randomInteger
// }
app.post('/api/persons', (request,response,next) => {
  const body = request.body

  // if(!body.name || !body.number ){
  //     return response.status(400).json(
  //         {error: 'content Missing'}
  //     )
  // }
  // const repeatedName = phonebook.find(person => person.name === body.name);

  // if (repeatedName) {
  //     return response.status(400).json({ error: 'Name must be unique' });
  // }
  const person = new Person({
    name: body.name,
    number: body.number,
  })
  console.log(person)
  //phonebook = phonebook.concat(person) its not neccessary beacause whe saved in mongodb
  person.save().then(savedPerson => savedPerson.toJSON())
    .then(formattedPerson => response.json(formattedPerson))
    .catch(error => {
      console.log('Error:', error)
      next(error)
    })
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body
  const person = {
    name: name,
    number: number,
  }
  Person.findByIdAndUpdate(
    request.params.id,
    person,
    { new: true }
  )
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }else if (error.name === 'ValidationError'){
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})

