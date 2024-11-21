const { default: mongoose } = require("mongoose");
const Expense = require("../models/expense");
const UserModel = require("../models/user");
const friendsList = async (req, res) => {
    try {
        const userId = req.userId;
        console.log(userId);
        if (!userId) {
            return res.status(400).json({ error: "userId is required." });
        }

        
        const user = await UserModel.findById(userId).populate('friends', 'name profilePic'); 
        if (!user || !user.friends) {
            return res.status(400).json({ error: "User not found or no contacts available." });
        }

        const contacts = user.friends;

        if (!Array.isArray(contacts) || contacts.length === 0) {
            return res.status(400).json({ error: "No contacts found for the user." });
        }

        
        const recentExpenses = await Expense.aggregate([
            {
                $match: {
                    $or: contacts.map(contact => ({
                        $or: [
                            { createdBy: new mongoose.Types.ObjectId(userId), createdWith: { $in: [ new mongoose.Types.ObjectId(contact._id)] } },
                            { createdBy: new mongoose.Types.ObjectId(contact._id), createdWith: { $in: [ new mongoose.Types.ObjectId(userId)] } }
                        ]
                    })),
                },
            },
            { $sort: { createdAt: -1 } },
            {
                $group: {
                    _id: {
                        contactId: {
                            $cond: [
                                { $eq: ["$createdBy",new  mongoose.Types.ObjectId(userId)] },
                                { $arrayElemAt: ["$createdWith", 0] },
                                "$createdBy"
                            ]
                        }
                    },
                    latestExpense: { $first: "$$ROOT" }
                }
            }
        ]);

        
        const expenseMap = new Map();
        recentExpenses.forEach(expense => {
            expenseMap.set(expense._id.contactId.toString(), expense.latestExpense);
        });
        // Prepare response
        const response = contacts.map(contact => ({
            contactId: contact._id,
            name: contact.name,
            profilePic: contact.profilePic,
            expense: expenseMap.get(contact._id.toString()) || null,
        }));

        return res.status(200).json({ data: response, message: "Fetched successfully", success: true });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error." });
    }
};


const uploadProfilePic = async (req, res) => {
    try {
        const userId = req.userId; // Directly access userId from req.userId
        const profilePicUrl = req.file?.path;  // Ensure the file path exists

        if (!userId || !profilePicUrl) {
            return res.status(400).json({ message: 'Missing userId or file.' });
        }

        // Update the user's profile with the new picture URL
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { profilePic: profilePicUrl },
            {
                new: true,
                select: 'profilePic' // This is the correct way to select specific fields
            }
        );
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.',success:false });
        }

        // Success response
        res.status(200).json({
            message: 'Profile picture uploaded successfully!',
            data: updatedUser, // Return the updated user object
            success:true
        });
    } catch (error) {
        console.error('Error updating profile picture:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

module.exports = { friendsList, uploadProfilePic };
