const {getUser} = require('../controllers/adminController');
const express = require('express');
const { isAdminOrSuperAdmin } = require('../middleware/verifyToken');
const adminRoute = express.Router();

adminRoute.get('/getUser', isAdminOrSuperAdmin, getUser);

module.exports = adminRoute;