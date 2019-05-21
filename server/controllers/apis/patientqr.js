const express = require('express');
const patientQRService = require('../../services/dashboard/qr/patientqr');

const router = express.Router();

router.get('/:resid', patientQRService.readPatientQR);

module.exports = router;
