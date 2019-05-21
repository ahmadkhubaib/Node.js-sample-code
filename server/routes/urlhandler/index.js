const express = require('express');
const urlHandlerController = require('./urlHandler');

const router = express.Router();

router.use('/', urlHandlerController);

module.exports = router;
