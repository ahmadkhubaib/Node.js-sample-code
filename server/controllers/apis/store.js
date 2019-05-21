const passport = require('passport');
const express = require('express');
const storeService = require('../../services/pharmacy/createstore');
const updateService = require('../../services/pharmacy/updatestore');

const router = express.Router();

router.post('/create', passport.authenticate('jwt', { session: false }), storeService.createStore);
router.post('/update', passport.authenticate('jwt', { session: false }), updateService.updateStore);


module.exports = router;
