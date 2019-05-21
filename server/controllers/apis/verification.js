const passport = require('passport');
const express = require('express');
const verificationService = require('../../services/authentication/verification');

const router = express.Router();

router.post('/token/send', passport.authenticate('jwt', { session: false }), verificationService.sendVerification);
router.get('/:tid', verificationService.confirmVerification);

module.exports = router;
