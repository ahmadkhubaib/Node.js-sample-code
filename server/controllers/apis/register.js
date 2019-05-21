const express = require('express');
const registerService = require('../../services/authentication/register');

const router = express.Router();

router.post('/', registerService.registerUser);

module.exports = router;
