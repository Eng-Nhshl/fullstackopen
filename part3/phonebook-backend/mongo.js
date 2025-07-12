const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as an argument!')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://engnhshl:${password}@cluster0.jskpu8e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set(`strictQuery`, false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('person', personSchema)

const person = new Person({
  name: 'Mo-Saleh',
  number: '774-777-172'
})


// person.save().then(result => {
//   console.log('person saved')
//   mongoose.connection.close()
// })

Person.find({}).then(result => {
  console.log('Phonebook:')
  result.forEach(person => {
    console.log(`${person.name} - ${person.number}`)
  })
  mongoose.connection.close()
})