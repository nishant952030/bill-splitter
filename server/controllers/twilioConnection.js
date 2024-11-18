const twilio = require("twilio");
const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } = process.env;
const client = new twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
const otpStore = {};
const sendOTP = async (req, res) => {
    const { mobileNumber } = req.body;
    const otp = generateOTP();
    const expiryTime = Date.now() + 5 * 60 * 1000; 
    otpStore[mobileNumber] = { otp, expiryTime };
    try {
        await client.messages.create({
            body: `Your OTP code is ${otp}`,
            from: TWILIO_PHONE_NUMBER,
            to: mobileNumber
        });
        res.status(200).json({ message: "OTP sent successfully." ,success:true});
    } catch (error) {
        res.status(500).json({ message: "Failed to send OTP.", error: error.message });
    }
};

const verifyOTP = (req, res) => {
    const { mobileNumber, otp } = req.body;
    const storedData = otpStore[mobileNumber];

    if (!storedData) {
        return res.status(400).json({ message: "OTP not found. Please request a new one." });
    }

 
    if (Date.now() > storedData.expiryTime) {
        delete otpStore[mobileNumber];
        return res.status(400).json({ message: "OTP has expired." });
    }


    if (storedData.otp === otp) {
        delete otpStore[mobileNumber]; 
        res.status(200).json({ message: "Mobile number verified successfully.",success:true });
    } else {
        res.status(400).json({ message: "Invalid OTP. Please try again." });
    }
};
module.exports = {
    sendOTP,
    verifyOTP
};