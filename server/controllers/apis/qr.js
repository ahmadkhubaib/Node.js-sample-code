const express = require('express');
const qrService = require('../../services/dashboard/qr/qr');

const router = express.Router();

router.post('/', qrService.genQR);

module.exports = router;
