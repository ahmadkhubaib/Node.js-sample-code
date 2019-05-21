const passport = require('passport');
const express = require('express');
const addmedicinesService = require('../../services/authentication/superuser/addmedicines');

const router = express.Router();

router.post('/', passport.authenticate('jwt', { session: false }), addmedicinesService.addMedicines);

module.exports = router;
