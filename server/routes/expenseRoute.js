const express = require("express");
const { isAuthenticated } = require("../middleware/authMiddleware");
const { addExpense, getAllExpenses } = require("../controllers/expenseController");
const router = express.Router();
router.post("/create-expense/:splitwith", isAuthenticated, addExpense);
router.get("/all-expenses/:splitwith", isAuthenticated, getAllExpenses);
module.exports=router