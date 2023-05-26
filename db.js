const mongoose = require('mongoose');
const dotenv = require("dotenv")
dotenv.config({path:'../inoteClient/.env.local'})

const mongoURI =`${process.env.REACT_APP_URI}`

const connecttomongo = () => {
    mongoose.connect(mongoURI,
        console.log("Connected"),
    )
}
module.exports = connecttomongo;
