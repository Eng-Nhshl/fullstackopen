const mongoose = require('mongoose')

const url = 'mongodb://localhost:27017/testNoteApp'

mongoose.set('strictQuery', false)

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    minlength: 5
  },
  important: Boolean,
  date: {
    type: Date,
    default: Date.now
  }
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
  content: 'async/await simplifies making async calls',
  important: true
})


note.save().then(() => {
  console.log('note saved')
})

Note.find({}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})
