const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true 
    },

    userName: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    }

})


userSchema.pre('save', async function(next) {
    if (this.isModified('password')){
        //console.log("Password Pre exucuted")
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
})

const User = mongoose.model('User', userSchema)
module.exports = User;