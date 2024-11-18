const express = require("express");
const { isAuthenticated } = require("../middleware/authMiddleware");
const {
    addExpense,
    getAllExpenses,
    getRecent,
    updateStatus,
    updateReciverConfirm,
    getGiveTake,
    getAllExpensesforMakingChart
} = require("../controllers/expenseController");

const router = express.Router();
router.post("/create-expense/:splitwith", isAuthenticated, addExpense);
router.get("/all-expenses/:splitwith", isAuthenticated, getAllExpenses);


router.get("/recent-expenses", isAuthenticated, getRecent);


router.get("/update-expense/:expenseId", isAuthenticated, updateStatus);

// Route to confirm receipt by the receiver for a specific expense
router.get("/reciever-confirm/:expenseId", isAuthenticated, updateReciverConfirm);
router.get("/give-take/:recieverId", isAuthenticated, getGiveTake);
router.get("/for-chart", isAuthenticated, getAllExpensesforMakingChart);

module.exports = router;
