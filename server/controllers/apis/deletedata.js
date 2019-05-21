const passport = require('passport');
const express = require('express');
const deletedataService = require('../../services/dashboard/gdpr/deletedata');

const router = express.Router();

router.post('/', passport.authenticate('jwt', { session: false }), deletedataService.deleteData);

module.exports = router;
