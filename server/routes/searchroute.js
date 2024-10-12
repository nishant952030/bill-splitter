const express = require("express");
const { searchUser, addUser,  findRequests, actionRequest } = require("../controllers/search");
const { isAuthenticated } = require("../middleware/authMiddleware");

const router = express.Router();
router.get("/search-user",isAuthenticated,searchUser)
router.get("/add-user/:id",isAuthenticated,addUser)
router.get("/profile", isAuthenticated, findRequests);
router.get("/action/:id/:reqId/:action", isAuthenticated, actionRequest);
module.exports = router