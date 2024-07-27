const UserModel = require("../models/user");
const bcryptjs = require('bcryptjs');

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password",
                error: true
            });
        }
        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid email or password",
                error: true
            });
        }
        return res.status(200).json({
            message: "Login successful",
            data: user,
            success: true
        });
    } catch (error) {
        console.log('Something went wrong', error);
        return res.status(500).json({
            message: error.message || error,
            error: true
        });
    }
};

module.exports = loginUser;
