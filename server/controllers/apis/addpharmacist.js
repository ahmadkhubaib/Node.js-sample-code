const passport = require('passport');
const express = require('express');
const addPharmacistService = require('../../services/profile/addpharmacist');

const router = express.Router();

router.post('/', passport.authenticate('jwt', { session: false }), addPharmacistService.addpharmacist);

module.exports = router;
