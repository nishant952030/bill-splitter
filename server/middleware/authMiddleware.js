const jwt = require("jsonwebtoken");

const isAuthenticated = async (req, res, next) => {
    try {
        let token = req.cookies.token;
        if (!token && req.headers.authorization) {
            const authHeader = req.headers.authorization;
            if (authHeader.startsWith("Bearer ")) {
                token = authHeader.split(" ")[1];
            }
        }
        if (!token) {
            return res.status(401).json({
                message: "User not authenticated",
                success: false
            });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.userId = decoded.id;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: "Token has expired",
                success: false
            });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({
                message: "Invalid token",
                success: false
            });
        } else {
            return res.status(403).json({
                message: "Authentication failed",
                success: false
            });
        }
    }
};

module.exports = { isAuthenticated };


