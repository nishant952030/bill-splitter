const Request = require("../models/request");
const UserModel = require("../models/user");
const searchUser = async (req, res) => {
    try {
        const username = req.query.username;
        const userId = req.userId;

        if (!username) {
            return res.status(400).json({
                message: "Username is required",
                success: false
            });
        }

        const user = await UserModel.findOne({ username: username });
        if (!user) {
            return res.status(404).json({
                message: "User does not exist",
                success: false
            });
        }

        if (user._id.equals(userId)) { // Using equals for ObjectId comparison
            return res.status(200).json({
                success: true,
                data: user,
                me: true
            });
        }

        const self = await UserModel.findById(userId);
        const isFriend = self.friends.includes(user._id);
        if (isFriend) {
            return res.status(200).json({
                message: "Already friend",
                isFriend: true,
                data: user,
                success: true,
                me: false
            });
        }

        // Updated query to handle both sent and received requests
        const requested = await Request.findOne({
            $or: [
                { senderId: userId, recieverId: user._id },
                { senderId: user._id, recieverId: userId }
            ]
        });

        if (requested) {
            return res.status(200).json({
                message: "User found",
                data: user,
                status: requested.status,
                isFriend: false,
                me: false,
                success: true

            });
        }

        return res.status(200).json({
            message: "User found",
            data: user,
            success: true,
            isFriend: false,
            status: null,
            me: false
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "An error occurred while searching for the user",
            success: false
        });
    }
};


const addUser = async (req, res) => {
    try {
        const userId = req.userId;
        const otherUserId = req.params.id;

        const user = await UserModel.findOne({ _id: otherUserId });

        const request = await Request.create({
            senderId: userId,
            recieverId: otherUserId
        });
        await request.save();
        user.requests.push(request._id);
        await user.save();
        return res.status(200).json({
            message: "Request sent successfully",
            data: user,
            success: true
        })
    }
    catch (error) {
        console.log(error);
    }
}
const findRequests = async (req, res) => {
    try {
        const userId = req.userId;
        const response = await Request.find({ recieverId: userId, status: 'pending' })
            .populate('senderId'); // Populate the senderId with specific fields

        return res.status(200).json({
            message: "All the requests pending",
            success: true,
            data: response
        });
    } catch (error) {
        console.log(error); // Corrected the console log statement
        return res.status(500).json({
            message: "Error retrieving requests",
            success: false,
            error: error.message,
        });
    }
}
const actionRequest = async (req, res) => {
    try {
        const userId = req.userId; // Current logged-in user
        const senderId = req.params.id; // Sender of the friend request
        const action = req.params.action; // Action: accept or reject
        const requestId = req.params.reqId; // Request ID of the friend request
        const self = await UserModel.findById(userId); // Logged-in user
        const sender = await UserModel.findById(senderId); // Sender of the request

        if (!sender) {
            return res.status(500).json({
                message: "Maybe the user doesn't exist",
                success: false,
            });
        }
        const request = await Request.findById(requestId);

        if (action === 'accept') {
            self.friends.push(senderId);
            sender.friends.push(userId);
            request.status = 'accepted';
            await self.save();
            await sender.save();
            await request.save();

            // Delete the request after accepting
            await Request.deleteOne({ _id: requestId });
            await request.save();
            return res.status(200).json({
                message: "Friend request accepted",
                success: true,
            });
        }

        if (action === 'reject') {
            request.status = 'rejected';
            await request.save();

            // Delete the request after rejecting
            await Request.deleteOne({ _id: requestId });

            return res.status(200).json({
                message: "Friend request rejected",
                success: true,
            });
        }

        return res.status(400).json({
            message: "Invalid action",
            success: false,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "An error occurred while processing the request",
            success: false,
        });
    }
};
const getUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({ 
                message: 'User not found',
            success:false});
        }

        res.status(200).json({
            message: "user fetched",
            data: user,
            success:true
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Server error' });
    }
}
module.exports = {
    searchUser,
    addUser,
    findRequests,
    actionRequest,
    getUser
};
