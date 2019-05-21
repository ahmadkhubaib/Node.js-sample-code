const passport = require('passport');
const express = require('express');
const profileService = require('../../services/profile/viewprofile');

require('./../../../config/passport')(passport);

const router = express.Router();

router.post('/', passport.authenticate('jwt', { session: false }), profileService.viewProfile);

module.exports = router;
