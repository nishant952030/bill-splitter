const Notification = require("../models/notification");
const { getIo, connectedSockets } = require("../socketConnection");

const createNotificationsForIndividual = async (req, res) => {
    try {
        const { userId } = req;
        const { amount, description, type,name } = req.body;
        const { splitWith } = req.params;
        const notification = await Notification.create({
            createdBy: userId,
            amount,
            createdWith: [splitWith],
            message: description,
            type,
        });

        if (!notification) {
            return res.status(500).json({
                message: "Failed to create the notification.",
                success: false
            });
        }
        const receiverSocketId = connectedSockets.get(splitWith);
        console.log("Connected Sockets Map:", connectedSockets);
        console.log("splitWith Key:", splitWith);
        console.log("Receiver Socket ID:", receiverSocketId);
        
        if (receiverSocketId) {
            const notificationData = {
                ...notification.toObject(), 
                name  
            };
            getIo().to(receiverSocketId).emit('new-notification', notificationData);
        }
        
        return res.status(200).json({
            message: "Notification created successfully.",
            notification,
            success: true
        });

    } catch (error) {
        console.error("Error creating notification:", error);
        return res.status(500).json({
            message: "An error occurred while creating the notification.",
            error: error.message,
            success: false
        });
    }
};

const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({
            createdWith: { $in: [req.userId] },
            isRead: false  // Fetch only unread notifications
        })
            .sort({ createdAt: -1 })
            .populate('createdBy', 'name');  // Populate createdBy with user name

        return res.status(200).json({
            notifications,
            success: true
        });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return res.status(500).json({
            message: "Failed to fetch notifications.",
            error: error.message,
            success: false
        });
    }
};

const updateNotification = async (req, res) => {
    try {
        const notificationId = req.params.notification;  // Get the notification ID from request params
        const notification = await Notification.findById(notificationId);  // Find the notification by ID

        if (!notification) {
            return res.status(404).json({
                message: "Notification not found",
                success: false
            });
        }

        notification.isRead = true;  // Mark the notification as read
        await notification.save();  // Save the updated notification

        return res.status(200).json({
            message: "Notification updated successfully.",
            notification,
            success: true
        });
    } catch (error) {
        console.error("Error updating notification:", error);
        return res.status(500).json({
            message: "Failed to update notification.",
            error: error.message,
            success: false
        });
    }
};
const markAllseen = async (req, res)=> {
    try {
        const userId = req.userId;
        const notifications = await Notification.updateMany({
            createdWith: { $in: [req.userId] }, isRead: false}, { $set: { isRead: true } }
        );
        console.log(notifications)
        return res.status(200).json({
            message: "Notifications updated successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
    }
};
module.exports = { createNotificationsForIndividual, getNotifications, updateNotification ,markAllseen};
