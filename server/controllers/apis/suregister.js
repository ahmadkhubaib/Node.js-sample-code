const express = require('express');
const suregisterService = require('../../services/authentication/superuser/suregister');

const router = express.Router();

router.post('/', suregisterService.SURegister);

module.exports = router;
