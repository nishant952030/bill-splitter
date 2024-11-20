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
