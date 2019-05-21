const express = require('express');
const loginService = require('../../services/authentication/login');

const router = express.Router();

router.post('/', loginService.loginUser);

module.exports = router;
