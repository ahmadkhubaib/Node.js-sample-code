const passport = require('passport');
const express = require('express');
const requestdataService = require('../../services/dashboard/gdpr/requestdata');

const router = express.Router();

router.post('/', passport.authenticate('jwt', { session: false }), requestdataService.requestData);

module.exports = router;
