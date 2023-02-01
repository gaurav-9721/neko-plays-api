const express = require('express')
const jwt = require('jsonwebtoken')
const User = require('../db/userschema')
const bcrypt = require('bcryptjs')


router = express.Router();


router.get('/login', async (req, res) => {
    return res.send("hello")
})

router.post('/login', async (req, res) => {
    const email = req.body.email,
    password = req.body.password;

    if ((!email) || (!password)){
        return res.status(422).json({'error': 'Please fill all the fields!'})
    }

    const user = await User.findOne({'email': email})

    if (!user){
        return res.status(422).json({'error':'Invalid Credentials'})
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch){
        return res.status(422).json({'error':'Invalid Credentials'})
    }

    // JWT TOKEN
    const jwttoken = await jwt.sign({'_id': user._id}, process.env.SECRET_KEY)
    //console.log(token)
    res.cookie("nekoplays", jwttoken, {
        httpOnly: true,
        maxAge: 3600000
    })

    console.log("Login successful")
    return res.status(200).json({"message": "Login Successful"})
    
})

router.get('/logout', async (req, res) => {
    res.clearCookie('nekoplays')
    return res.status(200).json({'message': 'Logout Successful'})
})

router.get('/userloggedin', async (req, res) => {
    const jwtToken = req.cookies.nekoplays;
    const verifyToken = jwt.verify(jwtToken, process.env.SECRET_KEY)

    if (verifyToken){
        return res.status(200).json({"login": "true"})
        console.log('User Logged in')
    }
    else{
        return res.status(404).json({"login": "false"})
        console.log('User Logged out')
    }
})

module.exports = router;