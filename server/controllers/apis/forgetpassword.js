const express = require('express');
const resetService = require('../../services/authentication/forgetpassword');
const tokenVerificationService = require('../../services/authentication/reset');

const router = express.Router();

router.post('/', resetService.sendResetRequest);
router.get('/reset/:resetToken', tokenVerificationService.resetTokenVerification);
router.post('/reset/:resetToken', tokenVerificationService.updatePassword);

module.exports = router;
