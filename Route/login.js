const express = require('express')
const jwt = require('jsonwebtoken')
const User = require('../db/userschema')
const bcrypt = require('bcryptjs')


router = express.Router();


router.get('/login', async (req, res) => {
    return res.send("hello login")
})

router.post('/login', async (req, res) => {
    //res.append("Access-Control-Allow-Origin", process.env.CLIENT_URL); 
    //res.append("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    console.log(req.body.body)
    const email = req.body.body.email,
        password = req.body.body.password;
    //console.log('Login request', password, email)

    if ((!email) || (!password)) {
        return res.status(422).json({ 'error': 'Please fill all the fields!' })
    }

    const user = await User.findOne({ 'email': email })

    if (!user) {
        return res.status(422).json({ 'error': 'Invalid Credentials' })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
        return res.status(422).json({ 'error': 'Invalid Credentials' })
    }

    // JWT TOKEN
    const jwttoken =  jwt.sign({ '_id': user._id }, process.env.SECRET_KEY)
    console.log("JWT", jwttoken)
    res.header("Access-Control-Allow-Origin", "https://neko-plays.onrender.com");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Credentials", true);
    try{
        console.log("Enter cookie")
        res.cookie("nekoplays", jwttoken,  { 
            expires: new Date(Date.now() + 900000), 
            httpOnly: true, 
            secure: true,
            sameSite : "none"
        })
    }catch(err){
        console.log('Error', err)
    }
    

    //console.log("Login successful")

    return res.status(200).json({ "message": "Login Successful" })

})

router.get('/logout', async (req, res) => {
    res.clearCookie('nekoplays')
    console.log("Logout Success")
    return res.status(200).json({ 'message': 'Logout Successful' })
})

router.get('/userloggedin', async (req, res) => {
    const jwtToken = req.cookies.nekoplays;
    // res.append("Access-Control-Allow-Origin", ["http://localhost:3000"]);
    // res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    try {
        const verifyToken = jwt.verify(jwtToken, process.env.SECRET_KEY)

        if (verifyToken) {
            res.status(200)
            res.send({ "login": true })

        }
        else {
            res.status(422)
            res.send({ "login": false })
            console.log('User Logged out')
        }
    }
    catch (err) {
        res.status(200)
        res.send({ "login": false })
        console.log('Cookie JWT does not exist')
    }

})

module.exports = router;