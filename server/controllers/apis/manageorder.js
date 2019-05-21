const passport = require('passport');
const express = require('express');
const manageOrderService = require('../../services/orders/manageorder');

const router = express.Router();

router.post('/', passport.authenticate('jwt', { session: false }), manageOrderService.manageOrder);

module.exports = router;
