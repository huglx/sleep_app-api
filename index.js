const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const todoRoutes = require('./routes/route')

const PORT = process.env.PORT || 3000

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

app.use(todoRoutes)

async function start() {
  try {
    await mongoose.connect(
      'mongodb+srv://Ivan:ue8MbKsgR6SEcR2@cluster0.vnsy8.mongodb.net/test',
      {
        useNewUrlParser: true,
        useFindAndModify: false
      }
    )
    app.listen(PORT, () => {
      console.log('Server has been started...')
    })
  } catch (e) {
    console.log(e)
  }
}

start()