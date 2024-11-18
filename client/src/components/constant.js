
require('dotenv').config();

const userRoute = `${process.env.BASE_URL}${process.env.USER_ROUTE}`;
const expenseRoute = `${process.env.BASE_URL}${process.env.EXPENSE_ROUTE}`;
const searchRoute = `${process.env.BASE_URL}${process.env.SEARCH_ROUTE}`;
const groupRoute = `${process.env.BASE_URL}${process.env.GROUP_ROUTE}`;
const notificationRoute = `${process.env.BASE_URL}${process.env.NOTIFICATION_ROUTE}`;

module.exports = {
    userRoute,
    expenseRoute,
    searchRoute,
    groupRoute,
    notificationRoute,
};
