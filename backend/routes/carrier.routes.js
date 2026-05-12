const express = require('express');
const router = express.Router();
const carrierController = require('../curriculum/carrier/carrier.controller');

// Optional: Add authentication middleware here
// const { verifyToken } = require('../../auth/firebase/middleware');
// router.use(verifyToken);

router.post('/create', carrierController.createCarrier);
router.post('/bulk', carrierController.createBulkCarriers);
router.get('/view', carrierController.getAllCarriers);
router.put('/:id', carrierController.updateCarrier); // update carrier fields
router.delete('/:id', carrierController.deleteCarrier); // delete carrier using its ID 
router.delete('/deleteAll', carrierController.deleteAllCarriers); // delete all carrier

module.exports = router;
