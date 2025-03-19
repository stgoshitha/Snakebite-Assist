const express = require('express');
const { register, login, logout, getOneUser } = require('../controllers/authController');
const authRoute = express.Router();

authRoute.post('/register', register );
authRoute.post('/login', login );
authRoute.post('/logout', logout );
authRoute.get('/user/:userId', getOneUser);

module.exports = authRoute;

