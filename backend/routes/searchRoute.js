const express = require('express');
const {search,findNearestHospitals} = require('../controllers/searchController') ;
const searchRouter = express.Router();

searchRouter.get('/search', search);
searchRouter.get('/hospitals/nearest', findNearestHospitals);
module.exports = searchRouter;
