const express = require("express");
const router = express.Router();
const registerUser = require("../controllers/signup");
const login = require("../controllers/login");
router.post('/signup', registerUser);
router.post('/login',login)
module.exports=router