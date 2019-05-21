const passport = require('passport');
const express = require('express');
const profileService = require('../../services/profile/profile');

require('../../../config/passport')(passport);

const router = express.Router();

router.post('/', passport.authenticate('jwt', { session: false }), profileService.viewProfile);
router.put('/update', passport.authenticate('jwt', { session: false }), profileService.updateProfile);

module.exports = router;
