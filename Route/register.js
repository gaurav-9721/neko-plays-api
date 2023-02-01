const express = require('express')
router = express.Router()

const User = require('../db/userschema')


router.get('/register', async (req, res) => {
    
    return res.status(200).json({"message": "Get hoggyaaa registerr"})
})

router.post('/register', async (req, res) => {
    const username = req.body.username.toString().trim(),
    name = req.body.fullname.toString().trim(),
    email = req.body.email.toString().trim(),
    pass = req.body.password.toString().trim(),
    cpass = req.body.cpassword.toString().trim()


    console.log(name, email)
    if ((!username) ||  (!name) ||  (!email) ||  (!pass) ||  (!cpass)) {
        return res.status(422).json({ "error": "Please fill all the fields properly" })
    }

    const emailExists = await User.findOne({ "email": email})
    const usernameExists = await User.findOne({ "userName": username})

    if (emailExists){
        return res.status(422).json({ "error": "Email already exists" })
    }

    if (usernameExists){
        return res.status(422).json({ "error": "Username not available" })
    }

    if (pass != cpass){
        return res.status(422).json({ "error": "Password Mismatch" })
    }

    const user = new User({
        "fullName": name,
        "userName": username,
        "email": email,
        "password": pass
    })

    const registerSuccessful = await user.save()

    if (registerSuccessful){
        console.log(user)
        console.log("Registration Successful")
        return res.status(201).json({ 'message': "Registered successfully"})
    }else{
        return res.status(500).json({ 'message': "Registeration Failed"})
    }

})

module.exports = router;