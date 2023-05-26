const jwt = require('jsonwebtoken')
const JWT_SECRET = "amalmohanam@l"


const fetchuser = (req, res, next) => {
    //get user from jwt token and add id to req object
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ error: 'Please authenticate usng a valid token' })
    }
    try {

        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        console.log(req.user.id)
        next();
    } catch (error) {
        res.status(401).send({ error: 'Please authenticate usng a valid token' })

    }
}

module.exports=fetchuser;