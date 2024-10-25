const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',   
        required: true,
    },
    createdWith: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',   
        required: true,
    }],
    type: {
        type: String,
        enum: ['friendRequest', 'expense'],  
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    
    amount: {
        type: Number,
        required: function () {
            return this.type === 'expense';
        },
    }
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
