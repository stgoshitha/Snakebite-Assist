const express = require('express');
const {search} = require('../controllers/searchController') ;
const searchRouter = express.Router();

searchRouter.get('/search', search);

module.exports = searchRouter;
