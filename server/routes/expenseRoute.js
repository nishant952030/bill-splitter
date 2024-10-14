const express = require("express");
const { isAuthenticated } = require("../middleware/authMiddleware");
const { addExpense, getAllExpenses, getRecent, updateStatus, updateReciverConfirm } = require("../controllers/expenseController");
const router = express.Router();
router.post("/create-expense/:splitwith", isAuthenticated, addExpense);
router.get("/all-expenses/:splitwith", isAuthenticated, getAllExpenses);
router.get("/recent-expenses", isAuthenticated, getRecent);
router.get("/update-expense/:expenseId", isAuthenticated, updateStatus);
router.get("/reciever-confirm/:expenseId", isAuthenticated, updateReciverConfirm);
module.exports=router