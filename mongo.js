// This module is not exported and shouldnt be a problem
const mongoose = require('mongoose')
require('dotenv').config()
if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

//get name and number by parameters  
const name = process.argv[3]
const number = process.argv[4]

mongoose.connect(process.env.MONGODB_URI)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })
module.exports = mongoose.model('Person', personSchema)
const Person = mongoose.model('Person', personSchema)



const person = new Person({
  name: name,
  number:number
})

if(name !== undefined && number !== undefined){
    person.save().then(result => {
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
      })
}



//Obtain all database
if(name === undefined && number === undefined){
Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })
}