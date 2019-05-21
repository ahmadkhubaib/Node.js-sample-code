const express = require('express');
const orderQRService = require('../../services/dashboard/qr/orderqr');

const router = express.Router();

router.get('/:id', orderQRService.readOrderQR);

module.exports = router;
