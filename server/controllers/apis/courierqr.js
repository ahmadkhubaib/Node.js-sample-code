const express = require('express');
const courierQRService = require('../../services/dashboard/qr/courierqr');

const router = express.Router();

router.get('/:resid', courierQRService.readCourierQR);

module.exports = router;
