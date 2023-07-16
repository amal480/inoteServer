const mongoose = require('mongoose');
const dotenv = require("dotenv")
dotenv.config({path:'../inoteServer/.env.production'})

const mongoURI =`${process.env.REACT_APP_URI}`

const connecttomongo = async() => {
    await mongoose.connect(mongoURI,
        console.log("Connected"),
        console.log(process.env.REACT_APP_URI),
    )
}
module.exports = connecttomongo;
