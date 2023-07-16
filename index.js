const connecttomongo = require('./db');
const express = require('express')

// const dotenv = require("dotenv")
// dotenv.config({path:'../inoteServer/.env.production'})
// const port =process.env.PORT

connecttomongo();
const app = express()
var cors = require('cors')


app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello!')
})


//Available routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))




app.listen(process.env.PORT || 5000, () => {
  console.log(`Example app listening on port ${process.env.PORT}`)
})
