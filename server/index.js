const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser")
const cors = require("cors");
const router = require("./routes/route");
const app = express();
const port = 8000;
const user=require('./models/user')
// Middleware
app.use(bodyParser.json());
app.use(cors());
const mongoose = require('mongoose');
app.use(cors());
app.use(cookieParser());
// MongoDB connection
mongoose.connect("mongodb+srv://nishant735123:5OLkAZAOCZC5RBmt@cluster0.lpk6kxz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("MongoDB connected successfully"))
    .catch(err => console.error("MongoDB connection error:", err));


app.use('/user',router)
// Start the server
app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});
