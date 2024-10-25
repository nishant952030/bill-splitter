const express = require("express");
const { isAuthenticated } = require("../middleware/authMiddleware");
const { createNotificationsForIndividual, getNotifications, updateNotification } = require("../controllers/notifications");
const router = express.Router();

router.post(`/create-notification/:splitWith`, isAuthenticated, createNotificationsForIndividual);
router.get(`/get-notifications`, isAuthenticated, getNotifications);
router.get(`/update-notification/:notification`, isAuthenticated, updateNotification);
module.exports=router