const express = require("express");
const { isAuthenticated } = require("../middleware/authMiddleware");
const { CreateGroup, getMyGroups, createGroupExpense, getMyGroupExpenses, getMygroupExpenses, getGroupDetails } = require("../controllers/expenseController");
const router = express.Router();

router.post("/create-group", isAuthenticated, CreateGroup);
router.get("/get-groups", isAuthenticated, getMyGroups);
router.get("/get-group-details/:groupId", isAuthenticated,getGroupDetails);
router.post("/create-expense/:groupId", isAuthenticated, createGroupExpense)
router.get("/get-all-expenses/:groupId", isAuthenticated, getMygroupExpenses)
module.exports=router