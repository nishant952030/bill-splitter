const Expense = require("../models/expense");
const { rawListeners } = require("../models/request");
const UserModel = require("../models/user");

const addExpense = async (req, res) => {
    try {
        const userId = req.userId;
        const splitWith = req.params.splitwith;
        const { amount, description } = req.body;

        const splitAmount = amount / 2;

        const expense = new Expense({
            createdBy: userId,
            amount,
            description,
            createdWith: splitWith,
            splitAmount
        });

        await expense.save();

        await UserModel.updateOne(
            { _id: userId },
            { $push: { expenses: expense._id } }
        );

        await UserModel.updateOne(
            { _id: splitWith },
            {
                $push: { expenses: expense._id }
            }
        );
        console.log('Expense created and balances updated successfully.');
        res.status(201).json({
            message: 'Expense created successfully',
            expense,
            success: true
        });
    } catch (error) {
        console.error('Error creating expense:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
}
const getAllExpenses = async (req, res) => {
    try {
        const userId = req.userId;
        const splitWith = req.params.splitwith;

        // Query to find expenses where either:
        // - createdBy is userId and createdWith contains splitWith
        // - OR createdBy is splitWith and createdWith contains userId
        const expenses = await Expense.find({
            $or: [
                { createdBy: userId, createdWith: { $in: [splitWith] } },  // Scenario 1
                { createdBy: splitWith, createdWith: { $in: [userId] } }  // Scenario 2
            ]
        })
            .sort({ createdAt: -1 });  // Sort by createdAt, -1 for descending order (most recent first)

        // Respond with the found expenses
        res.status(200).json({ success: true, data: expenses });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


module.exports = {
    addExpense,
    getAllExpenses
}