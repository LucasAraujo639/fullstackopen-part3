const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const path = require('path');
const PORT = process.env.PORT || 3001

app.use(express.json());
app.use(cors())
app.use(express.static(path.join(__dirname, 'dist')));
//const dirnames = path.join(__dirname, 'dist')

let phonebook = [
    {id: 1, name:"Lucas", number:"1134700227" },
    {id: 2, name:"Enzo", number:"12345678" },
    {id: 3, name:"Leo", number:"919192390" },
];
app.get('/api/persons',(request,response)=>{
    response.json(phonebook)
    //console.log(dirnames)
    
})

morgan.token('postData', (req) => {
    if (req.method === 'POST') {
      return JSON.stringify(req.body);
    }
    return '';
  });
  app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'));

app.get('/info',(request,response)=>{
    const now = new Date();
    response.send(
        `<p>Phonebook has info for ${phonebook.length} people</p> <p>${now}</p>`
        
    )
})

app.get('/api/persons/:id',(request,response)=>{
    const id = Number(request.params.id)
    const person = phonebook.find(person => person.id === id)
    if(person){
        response.json(person)
    }else{
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response)=>{
    const id = Number(request.params.id)
    phonebook = phonebook.filter(person => person.id !== id)
    response.status(204).end()
})

const getRandomId = ()=>{
    const min = 1;
    const max = 100;
    const randomInteger = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomInteger
}
app.post('/api/persons', (request,response)=>{
    const body = request.body
    console.log(body)
    console.log(body.name)
    console.log(body.number)

    if(!body.name || !body.number ){
        return response.status(400).json(
            {error: "content Missing"}
        )
    }
    const repeatedName = phonebook.find(person => person.name === body.name);

    if (repeatedName) {
        return response.status(400).json({ error: "Name must be unique" });
    }
    const person = {
        name: body.name,
        number: body.number,
        id: getRandomId()
    }
    console.log(person)
    phonebook = phonebook.concat(person)
    response.json(person)

})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });






// const express = require('express')
// const app = express()
// app.use(express.json())
// let notes = [
//   {
//     id: 1,
//     content: "HTML is easy",
//     date: "2019-05-30T17:30:31.098Z",
//     important: true
//   },
//   {
//     id: 2,
//     content: "Browser can execute only Javascript",
//     date: "2019-05-30T18:39:34.091Z",
//     important: false
//   },
//   {
//     id: 3,
//     content: "GET and POST are the most important methods of HTTP protocol",
//     date: "2019-05-30T19:20:14.298Z",
//     important: true
//   }
// ]

// app.get('/', (request, response) => {
//     response.send('<h1>Hello Worldssa!</h1>')
//   })
  
//   app.get('/api/notes', (request, response) => {
//     response.json(notes)
//   })

//   app.get('/api/notes/:id', (request, response) => {
//     const id = Number(request.params.id)
//     const note = notes.find(note => note.id === id)
//     if (note) {
//         response.json(note)
//       } else {
//         response.status(404).end()
//       }
//   })

//   const generateId = () => {
//     const maxId = notes.length > 0
//       ? Math.max(...notes.map(n => n.id))
//       : 0
//     return maxId + 1
//   }
  
//   app.post('/api/notes', (request, response) => {
//     const body = request.body
  
//     if (!body.content) {
//       return response.status(400).json({ 
//         error: 'content missing' 
//       })
//     }
  
//     const note = {
//       content: body.content,
//       important: body.important || false,
//       date: new Date(),
//       id: generateId(),
//     }
  
//     notes = notes.concat(note)
  
//     response.json(note)
//   })


//   app.delete('/api/notes/:id', (request, response) => {
//     const id = Number(request.params.id)
//     notes = notes.filter(note => note.id !== id)
  
//     response.status(204).end()
//   })
  
//   const PORT = 3001
//   app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`)
//   })