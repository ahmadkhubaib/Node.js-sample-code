const express = require('express');
const v1ApiController = require('./v1');
// const conversationController = require('../../controllers/apis/conversationController');

const router = express.Router();

router.use('/v1', v1ApiController);
// router.get('/socket.io', conversationController);

module.exports = router;
