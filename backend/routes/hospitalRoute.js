const express = require('express');
const hospitalRouter = express.Router();
const {createHospital,getAllHospitalApproved,getAllHospitalNotApproved,getUserHospital,approveHospital,updateHospital,deleteHospital} = require('../controllers/hospitalController');
const {authenticate,isAdminOrSuperAdmin} = require('../middleware/verifyToken')

hospitalRouter.post('/createHospital', authenticate, createHospital);
hospitalRouter.get('/getAllHospitalApproved', isAdminOrSuperAdmin, getAllHospitalApproved);
hospitalRouter.get('/getAllHospitalNotApproved', isAdminOrSuperAdmin, getAllHospitalNotApproved);
hospitalRouter.get('/getUserHospital', authenticate, getUserHospital);
hospitalRouter.put('/updateHospital/:id',authenticate, updateHospital);
hospitalRouter.delete('/deleteHospital/:id',authenticate, deleteHospital);
hospitalRouter.put('/approve/:id', isAdminOrSuperAdmin, approveHospital);

module.exports = hospitalRouter;