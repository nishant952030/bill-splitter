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
                success: false
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
            name, email, username, password: hashpassword
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
const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'work.sharma.nishant@gmail.com',
        pass: 'lcuwgftpdnwtkvcl',
    },
});

// Verify connection
transporter.verify((error, success) => {
    if (error) {
        console.error('Error with email connection:', error);
    } else {
        console.log('Email service ready to send emails');
    }
});

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const saveOTP = async (userId) => {
    const otp = generateOTP();
    const otpExpiry = Date.now() + 10 * 60 * 1000;

    await User.findByIdAndUpdate(userId, { otp, otpExpiry });

    return otp;
};
const sendOTPEmail = async (email, otp) => {
    try {
        const mailOptions = {
            from: 'work.sharma.sharma@gmail.com', // Sender's email
            to: email, // Recipient's email
            subject: 'CashFLow verification',
            html: `
                <p>Hi,</p>
                <p>Your OTP for email verification is:</p>
                <h1>${otp}</h1>
                <p>This OTP is valid for 10 minutes.</p>
                <p>If you did not request this, please ignore this email.</p>
            `,
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

const signUpWithOtp = async (req, res) => {
    const { name, email, password, username } = req.body;

    try {
        // Check if email is already registered
        const existingUserByEmail = await UserModel.findOne({ email });
        if (existingUserByEmail) {
            return res.status(400).send('Email is already registered.');
        }

        // Check if username is already taken
        const existingUserByUsername = await UserModel.findOne({ username });
        if (existingUserByUsername) {
            return res.status(400).send('Username is already taken.');
        }

        // Generate OTP and set OTP generation time
        const otp = generateOTP(); // Function to generate a 6-digit OTP
        const otpGeneratedAt = new Date();

        const salt = await bcryptjs.genSalt(10);
        const hashpassword = await bcryptjs.hash(password, salt);
        const newUser = new UserModel({
            name,
            username,
            email,
            password:hashpassword, // Remember to hash passwords before saving in production
            otp,
            otpGeneratedAt,
        });

        // Save the new user to the database
        await newUser.save();

        // Send OTP to the user's email
        await sendOTPEmail(email, otp); // Function to send OTP via email

        return res.status(200).json({ message: 'Signup successful! Please verify your email using the OTP sent.',success:true });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error during signup.');
    }
};



const generateAuthToken = (user) => {
    const token = jwt.sign({ id: user._id.toString() }, process.env.SECRET_KEY, { expiresIn: '7d' });
    return token;
};

const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).send('User not found.');
        }

        if (user.isVerified) {
            return res.status(400).send('Email is already verified.');
        }

        if (user.otp !== otp) {
            return res.status(400).send('Invalid OTP.');
        }

        if (user.otpExpiry < Date.now()) {
            return res.status(400).send('OTP has expired. Please request a new one.');
        }

        // OTP is correct and user is verified
        user.isVerified = true;
        user.otp = null;
        user.otpExpiry = null;
        await user.save();

        // Generate authentication token
        const token = generateAuthToken(user);

        // Prepare user object for response (excluding password)
        const userObject = user.toObject();
        delete userObject.password;

        // Set authentication cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,  // You can set this to false for local testing if needed
            sameSite: 'Lax',  // Cookie expiration time (1 hour)
        });

        // Respond with success message and user data
        return res.status(200).json({
            message: 'Email successfully verified!',
            success: true,
            data: userObject,
            token: token,
            cookieSet: true 
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Server error.');
    }
}

const resendOtp = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).send('User not found.');
        }

        if (user.isVerified) {
            return res.status(400).send('Email is already verified.');
        }

        const otp = await saveOTP(user._id);
        await sendOTPEmail(user.email, otp);

        res.send('OTP has been resent.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error.');
    }
}
module.exports = { registerUser, verifyOtp, resendOtp, sendOTPEmail, signUpWithOtp };
