const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const router = require("./routes/route");
const searchrouter = require("./routes/searchroute");
const expenserouter = require("./routes/expenseRoute");
const grouprouter = require("./routes/group");
const mongoose = require("mongoose");
const Expense = require("./models/expense");
require('dotenv').config(); // Load environment variables

const app = express();
const port = process.env.PORT || 8000; // Use PORT from .env or default to 8000

app.use(express.json()); // Body parser for JSON
app.use(cookieParser()); // Cookie parser

// CORS configuration
const allowedOrigins = [
    'https://bill-splitter-zeta.vercel.app',
    'capacitor://localhost',
    'ionic://localhost',
    'http://localhost:3000',
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true // Allow credentials
}));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch(err => {
        console.error("MongoDB connection error:", err);
    });

// Define routes
app.use('/user', router);
app.use('/search', searchrouter);
app.use('/expense', expenserouter);
app.use('/group', grouprouter);

// Start the server
app.listen(port, () => {
    console.log(`Server is running at port ${ port }`);
});