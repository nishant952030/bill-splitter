const Expense = require("../models/expense");
const GroupExpense = require("../models/GroupExpense");
const Group = require("../models/GroupSchema");
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
const getRecent = async (req, res) => {
    try {
        const userId = req.userId;
        const recents = await Expense.find({
            $or: [
                { createdWith: userId },
                { createdBy: userId }
            ]
        })
            .populate('createdBy','name')  // Populate the 'createdBy' field
            .limit(10).sort({ createdAt: -1 });  // Limit the result to 10 documents

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
        const expenses = await Expense.find({
            $or: [
                { createdBy: userId, createdWith: { $in: [splitWith] } },
                { createdBy: splitWith, createdWith: { $in: [userId] } } 
            ]
        })
            .sort({ createdAt: -1 });  
        res.status(200).json({ success: true, data: expenses });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
const updateStatus = async (req, res) => {
   try {
       const userId = req.useId;
       const expenseId = req.params.expenseId;
       const expense = await Expense.findOne({ _id: expenseId });
       expense.status = 'settled';
       await expense.save();
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

        const groups = await Group.find({_id:groupId});

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
            userId:userId
        })
    } catch (error) {
        console.log(error);
    }
}

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
    getMygroupExpenses
}