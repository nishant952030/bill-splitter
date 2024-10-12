const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    senderId: { // The user who sent or received the friend request
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    recieverId: { // The user who sent or received the friend request
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: { // Status of the friend request
        type: String,
        enum: ['pending', 'accepted', 'rejected'], // Allowed values for status
        default: 'pending',
        required: true,
    },
}, { timestamps: true }); // Enable timestamps

module.exports = mongoose.model('Request', requestSchema);
