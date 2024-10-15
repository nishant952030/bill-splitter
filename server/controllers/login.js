const UserModel = require("../models/user");
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');


const generateAuthToken = (user) => {
    const token = jwt.sign({ id: user._id.toString() }, process.env.SECRET_KEY, { expiresIn: '7d' });
    console.log("token created",token)
    return token;
};


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

        const token = generateAuthToken(user);
        const userObject = user.toObject();
        delete userObject.password;  
 
        res.cookie('token', token, {
            httpOnly: true,
            secure: true, 
            sameSite: 'None',
            maxAge: 3600000
        });
        
        console.log('Setting cookie:', {
            name: 'token',
            value: token.substring(0, 10) + '...',  
            options: {
                httpOnly: true,
                secure: false,
                sameSite: 'Lax',
                path: '/',
                maxAge: 3600000
            }
        });

        return res.status(200).json({
            message: "Login successful",
            data: userObject,
            success: true,
            token:token,
            cookieSet: true 
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            message: error.message || "Internal server error",
            error: true
        });
    }
};

const logout = (req, res) => {
    res.clearCookie('token', { path: '/' });
    res.status(200).json({ message: 'Logged out successfully',success:true});
};
module.exports = { loginUser ,logout};