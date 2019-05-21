const passport = require('passport');
const express = require('express');
const stripeService = require('../../services/stripe/paymenthandler');

const router = express.Router();

router.post('/merchant/create', passport.authenticate('jwt', { session: false }), stripeService.createAccount);
router.post('/pay/add', passport.authenticate('jwt', { session: false }), stripeService.addPaymentMethod);
router.post('/pay/process', passport.authenticate('jwt', { session: false }), stripeService.chargePayment);
router.post('/pay/refund', passport.authenticate('jwt', { session: false }), stripeService.refundPayment);
router.put('/merchant/account/update/:pid', passport.authenticate('jwt', { session: false }), stripeService.updateAccount);
router.get('/merchant/view/:pid/:mid', passport.authenticate('jwt', { session: false }), stripeService.viewDetails);
router.post('/webhooks', stripeService.webHooks);

module.exports = router;
