// Load environment variables
require('dotenv').config();

// Import modules
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require('http');
const socketIo = require('socket.io');

// Import routes
const router = require("./routes/route");
const searchRouter = require("./routes/searchroute");
const expenseRouter = require("./routes/expenseRoute");
const groupRouter = require("./routes/group");
const { initializeSocket } = require('./socketConnection');

// Initialize app and set port
const app = express();
const port = process.env.PORT || 8000;

// Set up HTTP server and Socket.IO

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// CORS configuration
const allowedOrigins = [
    '*',
    'https://bill-splitter-zeta.vercel.app',
    'capacitor://localhost',
    'ionic://localhost',
    'http://localhost:3000',
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

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

const httpServer = http.createServer(app);
initializeSocket(httpServer);


app.use('/user', router);
app.use('/search', searchRouter);
app.use('/expense', expenseRouter);
app.use('/group', groupRouter);

httpServer.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});
