const UserModel = require("../models/user");

const friendsList = async (req, res) => {
    try {
        const userId = req.userId;

        // Find the logged-in user's friends list by their userId
        const user = await UserModel.findById(userId).populate('friends'); // Adjust fields to be populated

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Friends list",
            success: true,
            data: user.friends // Return the populated friends field
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "An error occurred while fetching the friends list",
            success: false
        });
    }
};

module.exports = friendsList;
