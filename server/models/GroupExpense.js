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
    description: {
        type: String,
        required: true,
        trim: true,
    },
    paidBy: {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',  // Reference to the User model
            required: true,
        },
        paidAt: {
            type: Date,
            default: Date.now,
        },
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
