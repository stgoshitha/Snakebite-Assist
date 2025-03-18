const express = require('express');
const { register, login, logout, getOneUser } = require('../controllers/authController');
const authRoutes = express.Router();

authRoutes.post('/register', register );
authRoutes.post('/login', login );
authRoutes.post('/logout', logout );
authRoutes.get('/user/:userId', getOneUser);

module.exports = authRoutes;

