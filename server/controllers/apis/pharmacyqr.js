const express = require('express');
const pharmacyQRService = require('../../services/dashboard/qr/pharmacyqr');

const router = express.Router();
router.get('/:id', pharmacyQRService.readPharmacyQR);

module.exports = router;
