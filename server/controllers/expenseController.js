const Expense = require("../models/expense");
const UserModel = require("../models/user");

const addExpense = async (req, res) => {
    try {
        const userId = req.userId;
        const { amount, description, splitWith } = req.body;
        const createdWithIds = splitWith;

        const splitAmount = amount / (createdWithIds.length + 1);

        const expense = new Expense({
            createdBy: userId,
            amount,
            description,
            createdWith: createdWithIds,
            splitAmount
        });

        await expense.save();

        await UserModel.updateOne(
            { _id: userId },
            { /* $inc: { balance: -amount }, */ $push: { expenses: expense._id } }
        );

        for (const userId of createdWithIds) {
            await UserModel.updateOne(
                { _id: userId },
                {
                    $push: { expenses: expense._id }
                }
            );
        }

        console.log('Expense created and balances updated successfully.');
        res.status(201).json({
            message: 'Expense created successfully',
            expense,
            success:true
        });
    } catch (error) {
        console.error('Error creating expense:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
}
