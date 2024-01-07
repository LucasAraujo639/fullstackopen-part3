const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator')
require('dotenv').config()

mongoose.set('strictQuery', false)

mongoose.connect(process.env.MONGODB_URI)
  .then( () => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true, // Hace que el campo sea unico
    required: true, // Asegura que el campo no este vacío
    minlength: 3, // Mínimo 3 caracteres para el nombre
  },
  number: {
    type: String,
    minlength: 8,
  }
})

personSchema.plugin(uniqueValidator); //with this the name and the number must be unique

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
module.exports = mongoose.model('Person', personSchema)