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
const allowedOrigins = [
     // Web app
    'http://another-frontend-domain.com', // If you have multiple domains
    'capacitor://localhost', // For Capacitor-based mobile apps (if using)
    'ionic://localhost',     // For Ionic-based mobile apps (if using)
    'http://localhost:3000', // For development (if your frontend runs on localhost)
];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin, like mobile apps
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true // Allow credentials (cookies, authorization headers)
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
