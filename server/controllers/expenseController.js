const Expense = require("../models/expense");
const GroupExpense = require("../models/GroupExpense");
const Group = require("../models/GroupSchema");
const Notification = require("../models/notification.js");
const UserModel = require("../models/user");
const { getIo } = require('../socketConnection.js');
const axios = require('axios');
const { connectedSockets } = require("../socketConnection.js");
const addExpense = async (req, res) => {
    try {
        const ioInstance = getIo();
        const userId = req.userId;
        const splitWith = req.params.splitwith;
        const { amount, description } = req.body;
        const splitAmount = amount / 2;

        // Create and save the expense
        const expense = new Expense({
            createdBy: userId,
            amount,
            description,
            createdWith: splitWith,
            splitAmount
        });

        await expense.save();
        const populatedExpense = await Expense.findById(expense._id)
            .populate('createdBy', 'name')
            .populate('createdWith', 'name');

        // Update users' expense lists
        await UserModel.updateOne({ _id: userId }, { $push: { expenses: expense._id } });
        await UserModel.updateOne({ _id: splitWith }, { $push: { expenses: expense._id } });
        res.status(201).json({
            message: 'Expense created successfully',
            expense: populatedExpense,
            success: true
        });
    } catch (error) {
        console.error('Error creating expense:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};

const getRecent = async (req, res) => {
    try {
        const userId = req.userId;
        const recents = await Expense.find({
            $or: [
                { createdWith: userId },
                { createdBy: userId }
            ]
        })
            .populate('createdBy', 'name')
            .limit(10)
            .sort({ createdAt: -1 });
        return res.status(200).json({
            message: "expenses",
            expenses: recents
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Server error' });
    }
};
const getAllExpenses = async (req, res) => {
    try {
        const userId = req.userId;
        const splitWith = req.params.splitwith;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const expenses = await Expense.find({
            $or: [
                { createdBy: userId, createdWith: { $in: [splitWith] } },
                { createdBy: splitWith, createdWith: { $in: [userId] } }
            ]
        })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Expense.countDocuments({
            $or: [
                { createdBy: userId, createdWith: { $in: [splitWith] } },
                { createdBy: splitWith, createdWith: { $in: [userId] } }
            ]
        });

        res.status(200).json({
            success: true,
            data: expenses,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalExpenses: total
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const updateStatus = async (req, res) => {
    try {
        const userId = req.userId;
        const expenseId = req.params.expenseId;
        const expense = await Expense.findOne({ _id: expenseId });
        expense.status = 'settled';
        await expense.save();
        console.log(expense)
        const notification = await Notification.create({
            createdBy: userId,
            createdWith: [expense.createdBy],
            message: `paid you ${expense.splitAmount}`,
            type: "paidExpense",
        })
        const io = getIo();
        const receiverSocketId = connectedSockets.get(expense.createdBy);
        io.to(receiverSocketId).emit('new-notification', notification);
        console.log(notification)
        return res.status(200).json({
            message: "setlled amount",
            success: true,
            data: expense
        })
    } catch (error) {
        console.log(error);
    }
}
const updateReciverConfirm = async (req, res) => {
    try {
        const userId = req.useId;
        const expenseId = req.params.expenseId;
        const expense = await Expense.findOne({ _id: expenseId });
        expense.confirmedByReciever = true;
        await expense.save();
        console.log(expense)
        return res.status(200).json({
            message: "Confirmed by reciever",
            success: true,
            data: expense
        })
    } catch (error) {
        console.log(error);
    }
}

const CreateGroup = async (req, res) => {
    try {
        const userId = req.userId;
        const { groupName, groupMembers } = req.body;

        if (!groupName || typeof groupName !== 'string') {
            return res.status(400).json({
                message: "Invalid or missing group name",
                success: false
            });
        }

        if (!Array.isArray(groupMembers) || groupMembers.length <= 1) {
            return res.status(400).json({
                message: "Group must contain at least two member",
                success: false
            });
        }

        if (!groupMembers.includes(userId)) {
            groupMembers.push(userId);
        }

        const group = await Group.create({
            name: groupName,
            members: groupMembers
        });

        return res.status(201).json({
            message: "Group created successfully",
            group,
            success: true
        });

    } catch (error) {
        console.error('Error creating group:', error);

        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
            success: false
        });
    }
};

const getMyGroups = async (req, res) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(400).json({
                message: "User ID is required",
                success: false
            });
        }

        const groups = await Group.find({
            members: { $in: [userId] }
        });

        if (groups.length === 0) {
            return res.status(404).json({
                message: "No groups found for the user",
                success: false
            });
        }

        return res.status(200).json({
            message: "Groups retrieved successfully",
            groups: groups,
            success: true
        });

    } catch (error) {
        console.error('Error getting groups:', error);

        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
            success: false
        });
    }
};
const getGroupDetails = async (req, res) => {
    try {
        const userId = req.userId;
        const { groupId } = req.params;
        if (!groupId) {
            return res.status(400).json({
                message: "Group ID is required",
                success: false
            });
        }

        const groups = await Group.find({ _id: groupId });

        if (groups.length === 0) {
            return res.status(404).json({
                message: "No group found for the user",
                success: false
            });
        }

        return res.status(200).json({
            message: "Group retrieved successfully",
            groups: groups,
            success: true
        });

    } catch (error) {
        console.error('Error getting groups:', error);

        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
            success: false
        });
    }
};

const createGroupExpense = async (req, res) => {
    try {
        const { groupId } = req.params;
        const userId = req.userId;
        const { description, amount } = req.body;


        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({
                message: "Group not found",
                success: false,
            });
        }

        const splitAmount = amount / group.members.length;
        const expenseData = {
            groupId,
            amount,
            splitAmount,
            description,
            paidBy: userId,
        };


        const expense = await GroupExpense.create(expenseData);

        return res.status(200).json({
            message: "Expense created successfully",
            expense,
            success: true,
        });

    } catch (error) {
        console.error("Error creating group expense:", error);

        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
            success: false,
        });
    }
};
const getMygroupExpenses = async (req, res) => {
    try {
        const { groupId } = req.params;
        const userId = req.userId;
        const group = await Group.find({ _id: groupId });
        if (!group) {
            return res.status(500).json({
                message: "Group is Invalid",
                success: false,
            })
        }
        console.log("this is the id of group", groupId)
        const expenses = await GroupExpense.find({ groupId: groupId })
            .populate({ path: 'paidBy', select: 'name' })
            .populate({ path: 'groupId', select: 'name members' });

        console.log(expenses)
        return res.status(200).json({
            message: "Group messages fetched successfully",
            data: expenses,
            success: true,
            groupId: groupId,
            userId: userId
        })
    } catch (error) {
        console.log(error);
    }
}
const getGiveTake = async (req, res) => {
    try {
        const { recieverId } = req.params;
        const userId = req.userId;

        // Find expenses where the current user is owed money (they 'take')
        const takeExpenses = await Expense.find({
            createdWith: recieverId, // assuming createdWith is the receiver field
            createdBy: userId,
            $or: [
                { status: "pending" },
                { confirmedByReciever: false }
            ]
        });

        // Find expenses where the current user owes money (they 'give')
        const giveExpenses = await Expense.find({
            createdWith: userId,
            createdBy: recieverId,
            $or: [
                { status: "pending" },
                { confirmedByReciever: false }
            ]
        });

        console.log(takeExpenses)
        // Calculate cumulative splitAmount for both 'take' and 'give'
        const totalTake = takeExpenses.reduce((sum, expense) => sum + expense.splitAmount, 0);
        const totalGive = giveExpenses.reduce((sum, expense) => sum + expense.splitAmount, 0);

        res.status(200).json({
            success: true,
            totalTake,
            totalGive
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching cumulative expenses.",
            error: error.message
        });
    }
};
require('dotenv').config();
const { spawn } = require('child_process');
const path = require('path');

// Function to classify expenses using a Python script
const classifyExpenses = async (expenses) => {
    return new Promise((resolve, reject) => {
        const scriptPath = path.join(__dirname, 'classiferMainFunction.py');
        const pythonProcess = spawn('python', [scriptPath]);

        let resultData = '';
        let errorData = '';

        // Capture the data from the Python script's stdout
        pythonProcess.stdout.on('data', (data) => {
            resultData += data.toString();
        });

        // Capture any errors from the Python script's stderr
        pythonProcess.stderr.on('data', (data) => {
            errorData += data.toString();
        });

        // Handle the completion of the Python script
        pythonProcess.on('close', (code) => {
            if (code !== 0 || errorData) {
                return reject(new Error(`Python script error: ${errorData}`));
            }
            try {
                const result = JSON.parse(resultData);
                resolve(result);
            } catch (error) {
                reject(new Error('Failed to parse Python output.'));
            }
        });

        // Send the expenses data to the Python script
        const input = JSON.stringify({ expenses });
        pythonProcess.stdin.write(input);
        pythonProcess.stdin.end();
    });
};

// Endpoint to fetch expenses and classify them
const getAllExpensesforMakingChart = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(400).json({ message: 'User ID is missing' });
        }

        // Fetch expenses for the user
        const expenses = await Expense.find(
            {
                $or: [
                    { createdBy: userId },
                    { createdWith: { $in: [userId] } }
                ]
            },
            'splitAmount createdAt description'
        ).sort({ createdAt: -1 });

        // Check if expenses exist
        if (expenses.length === 0) {
            return res.status(200).json({ message: 'No expenses found for this user' });
        }

        // Classify expenses using the Python script
        const classifiedData = await classifyExpenses(expenses);

        // Send back the classified data and expenses
        return res.status(200).json({
            expenses,
            success: true,
            message: 'Expenses fetched successfully',
            classifiedData,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Something went wrong while fetching expenses' });
    }
};


module.exports = {
    addExpense,
    getAllExpenses,
    getRecent,
    updateStatus,
    updateReciverConfirm,
    CreateGroup,
    getGroupDetails,
    getMyGroups,
    createGroupExpense,
    getMygroupExpenses,
    getGiveTake,
    getAllExpensesforMakingChart
}