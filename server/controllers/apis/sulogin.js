const express = require('express');
const suloginService = require('../../services/authentication/superuser/sulogin');

const router = express.Router();

router.post('/', suloginService.SULogin);

module.exports = router;
