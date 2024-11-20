const express = require("express");
const router = express.Router();
const registerUser = require("../controllers/signup");
const login = require("../controllers/login");

const { isAuthenticated } = require("../middleware/authMiddleware");
const {friendsList, uploadProfilePic} = require("../controllers/userDetails");
const { getUser } = require("../controllers/search");
const upload = require("../middleware/multer");

router.post('/signup', registerUser);
router.post('/login', login.loginUser)
router.get('/all-users',isAuthenticated,friendsList)
router.get('/logout',login.logout)
router.get('/get-details/:id', isAuthenticated, getUser)
router.post('/upload-profile-pic', isAuthenticated, upload.single('profilePic'),uploadProfilePic)

router.get('/isLoggedIn', isAuthenticated, (req, res) => {
    res.status(200).json({ message: 'User is authenticated', success:true });
})
module.exports=router