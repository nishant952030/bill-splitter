const mongoose = require('mongoose');

const GroupExpenseSchema = new mongoose.Schema({
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',  // Reference to the Group model
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    splitAmount: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    paidBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Reference to the User model
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const GroupExpense = mongoose.model('GroupExpense', GroupExpenseSchema);
module.exports = GroupExpense;
