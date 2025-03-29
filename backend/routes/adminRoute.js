const {getUser, blockUser, unblockUser, deletUser} = require('../controllers/adminController');
const express = require('express');
const { isAdminOrSuperAdmin,isSuperAdmin } = require('../middleware/verifyToken');
const adminRoute = express.Router();

adminRoute.get('/getUser', isAdminOrSuperAdmin, getUser);
adminRoute.patch('/blockUser/:userId', isAdminOrSuperAdmin, blockUser);
adminRoute.patch('/unblockUser/:userId', isAdminOrSuperAdmin, unblockUser);
adminRoute.delete('/deleteUser/:userId', isAdminOrSuperAdmin, isSuperAdmin, deletUser); 
module.exports = adminRoute;