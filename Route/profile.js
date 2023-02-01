const express = require('express')
const User = require('../db/userschema')
const authenticate = require('../middleware/authLogin')

router = express.Router();


router.get('/profile', authenticate, async (req, res) => {
    //console.log(req.user)
    if (req.userDetails){
        return res.send(req.userDetails)
    }
    return res.status(403).json({'error': 'Please login first'})
    
})

router.post('/profile', async (req, res) => {

    
})

module.exports = router;