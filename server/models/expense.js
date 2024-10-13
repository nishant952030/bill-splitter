const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    createdWith: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    splitAmount: {
        type: Number
    },
    status: {
        type: String,
        enum: ['pending', 'settled'],
        default: 'pending'
    }
});

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
