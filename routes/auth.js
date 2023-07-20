const express = require('express');
const User = require('../models/User')
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const dotenv = require("dotenv")
dotenv.config({path:'../inoteServer/.env.production'})
const fetchuser=require('../middleware/fetchuser')



const JWT_SECRET = process.env.jwt_secret

//Route 1:create a user with /api/auth/createuser. No login required
router.post('/createuser', [
    body('email', 'enter valid email').isEmail(),
    body('name').isLength({ min: 5 }),
    body('password').isLength({ min: 5 })
], async (req, res) => {
    let success=false;
    //If there are error return bad request and the error
    const error = validationResult(req);
    if (!error.isEmpty()) {
        success=false
        return res.status(400).json({ success,error: error.array() });
    }

    try {
        //check whether email exists already
        let user = await User.findOne({ email: req.body.email })
        if (user) {
            success=false
            return res.status(400).json({ success,error: "email already exists" })
        }

        const salt = await bcrypt.genSalt(10);
        const secpass = await bcrypt.hash(req.body.password, salt);
        user = await User.create({
            name: req.body.name,
            password: secpass,
            email: req.body.email
        })
        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET)
        // res.json(user)
        success=true
        res.json({ success,authtoken })

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error")
    }
    //   .then(user => res.json(user)).catch(err=>{console.log(err)
    //     res.json({error:'Please enter a unique email'})});
})

//Route 2:Authenticate a user with /api/auth/login. No login required
router.post('/login', [
    body('email', 'enter valid email').isEmail(),
    body('password', 'Password cannot be blank').exists()
], async (req, res) => {
    let success=false;
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
    }

    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email })
        if (!user) {
            success=false
            return res.status(400).json({success, error: "Please try to login with correct credentials" })
        }
        const passwordCompare = await bcrypt.compare(password, user.password)
        if (!passwordCompare) {
            success=false
            return res.status(400).json({success, error: "Please try to login with correct credentials" })
        }

        const data = {
            user: {
                id: user.id
            }
        }
        console.log(JWT_SECRET)
        const authtoken = jwt.sign(data, JWT_SECRET)
        success=true
        res.json({success,authtoken})
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error")
    }
})

//Route 3:Get user detail with /api/auth/getuser. login required
router.post('/getuser',fetchuser, async (req, res) => {
try {
    userID=req.user.id;
    const user=await User.findById(userID).select("-password");
    res.send(user)
} catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error")
}
}
)
module.exports = router