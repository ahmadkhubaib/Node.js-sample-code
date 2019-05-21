const express = require('express');

const router = express.Router();

const pharmacyQRController = require('../../controllers/apis/pharmacyqr');
const orderQRController = require('../../controllers/apis/orderqr');


router.use('/p', pharmacyQRController);
router.use('/o', orderQRController);

module.exports = router;
