const express = require('express');
const blacklistService = require('../../services/authentication/blacklist');

const router = express.Router();

router.post('/', blacklistService.blacklist);

module.exports = router;
