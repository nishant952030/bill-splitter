const UserModel = require("../models/user");
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
    try {
        const { name, email, password, username } = req.body;
        const findUsername = await UserModel.findOne({ username });
        if (findUsername) {
            return res.status(400).json({
                message: "username name not available",
                success:false
            })
        }
        const findEmail = await UserModel.findOne({ email });
        if (findEmail) {
            return res.status(400).json({
                message: "Email already exists",
                error: true
            });
        }
        const salt = await bcryptjs.genSalt(10);
        const hashpassword = await bcryptjs.hash(password, salt);
        const payload = {
            name, email,username, password: hashpassword
        };
        const user = new UserModel(payload);
        await user.save();

        // Generate token
        const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });

        // Set token in cookies
        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'Strict' });

        return res.status(200).json({
            message: "User created successfully",
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

module.exports = registerUser;
