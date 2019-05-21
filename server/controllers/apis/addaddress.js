const passport = require('passport');
const express = require('express');
const addressService = require('../../services/profile/address/addaddress');

const router = express.Router();

router.post('/add', passport.authenticate('jwt', { session: false }), addressService.addAddress);
router.post('/view', passport.authenticate('jwt', { session: false }), addressService.viewAddress);

module.exports = router;
