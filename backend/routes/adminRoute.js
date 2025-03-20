const {getUser, blockUser, unblockUser} = require('../controllers/adminController');
const express = require('express');
const { isAdminOrSuperAdmin } = require('../middleware/verifyToken');
const adminRoute = express.Router();

adminRoute.get('/getUser', isAdminOrSuperAdmin, getUser);
adminRoute.patch('/blockUser/:userId', isAdminOrSuperAdmin, blockUser);
adminRoute.patch('/unblockUser/:userId', isAdminOrSuperAdmin, unblockUser);

module.exports = adminRoute;