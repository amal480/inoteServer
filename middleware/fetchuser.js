const jwt = require('jsonwebtoken')
const dotenv = require("dotenv")
dotenv.config({path:'../inoteServer/.env.production'})
const JWT_SECRET = process.env.SECRET


const fetchuser = (req, res, next) => {
    //get user from jwt token and add id to req object
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ error: 'Please authenticate usng a valid token1' })
    }
    try {

        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        console.log(req.user.id)
        next();
    } catch (error) {
        res.status(401).send({ error: 'Please authenticate usng a valid token2' })

    }
}

module.exports=fetchuser;