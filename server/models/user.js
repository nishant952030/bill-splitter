const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'provide name'],
        unique: true
    },
    email: {
        type: String,
        required: [true, 'provide name'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'provide name']
    },
    profile_pic: {
        type: String,
        default: ""
    }
}, { timestamps: true })
const UserModel = mongoose.model('User', userSchema)
module.exports = UserModel