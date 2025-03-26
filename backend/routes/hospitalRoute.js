const express = require('express');
const hospitalRouter = express.Router();
const {createHospital,getAllHospitalApproved,getAllHospitalNotApproved,getOneHospital,approveHospital,updateHospital,deleteHospital} = require('../controllers/hospitalController');
const {authenticateHospital,isAdminOrSuperAdmin} = require('../middleware/verifyToken')

hospitalRouter.post('/createHospital', authenticateHospital, createHospital);
hospitalRouter.get('/getAllHospitalApproved', isAdminOrSuperAdmin, getAllHospitalApproved);
hospitalRouter.get('/getAllHospitalNotApproved', isAdminOrSuperAdmin, getAllHospitalNotApproved);
hospitalRouter.get('/getOneHospital/:id', authenticateHospital, getOneHospital);
hospitalRouter.put('/updateHospital/:id', authenticateHospital, updateHospital);
hospitalRouter.delete('/deleteHospital/:id', authenticateHospital, deleteHospital);
hospitalRouter.put('/approve/:id', isAdminOrSuperAdmin, approveHospital);

module.exports = hospitalRouter;