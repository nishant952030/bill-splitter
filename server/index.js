const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const router = require("./routes/route");
const searchrouter = require("./routes/searchroute");
const mongoose = require("mongoose");
require('dotenv').config(); // Add this line to load environment variables

const app = express();
const port = process.env.PORT || 8000; // Use PORT from .env or default to 8000

// Middleware
app.use(express.json()); // Body parser for JSON
app.use(cookieParser()); // Cookie parser

// CORS configuration to allow your frontend to communicate with backend
app.use(cors({
    origin: 'http://localhost:3000', // Replace with your front-end origin
    credentials: true // Allow credentials (cookies, authorization headers, etc.)
}));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { // Use environment variable for MongoDB URI
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("MongoDB connected successfully"))
    .catch(err => console.error("MongoDB connection error:", err));

// Routes
app.use('/user', router);
app.use('/search', searchrouter);

// Start the server
app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});
