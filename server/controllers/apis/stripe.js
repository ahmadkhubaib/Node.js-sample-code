const passport = require('passport');
const express = require('express');
const stripeService = require('../../services/stripe/paymenthandler');

const router = express.Router();

router.post('/create', passport.authenticate('jwt', { session: false }), stripeService.createAccount);
router.post('/initialize', passport.authenticate('jwt', { session: false }), stripeService.recievePayment);
router.post('/terms/update', passport.authenticate('jwt', { session: false }), stripeService.updateTerms);

module.exports = router;
