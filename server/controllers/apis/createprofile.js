const passport = require('passport');
const express = require('express');
const createProfileService = require('../../services/profile/createprofile');

const router = express.Router();

router.post('/', passport.authenticate('jwt', { session: false }), createProfileService.createProfile);

module.exports = router;
