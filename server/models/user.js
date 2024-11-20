const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true, // Ensure the username is unique
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
    }],
    requests: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Request"
        }
    ],
    expenses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Expense"
        }
    ],
    profilePic: {
        type: String,
        default: '',
    }

});

module.exports = mongoose.model('User', userSchema);
