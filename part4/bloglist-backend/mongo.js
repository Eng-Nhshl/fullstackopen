const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as an argument!')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://engnhshl:${password}@cluster0.jskpu8e.mongodb.net/testBolgsApp?
retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)

const blog = new Blog({
  title: 'Testing the Backend with supertest',
  author: 'Eng-Nhshl',
  url: 'http://localhost.com',
  likes: 20
})

blog.save().then(() => {
  console.log('blog saved')
})

Blog.find({}).then(result => {
  result.forEach(blog => {
    console.log(blog)
  })
  mongoose.connection.close()
})