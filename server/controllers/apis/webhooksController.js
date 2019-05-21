const express = require('express');
const webhooksService = require('../../services/webhooks/ordersevents');

const router = express.Router();

router.get('/events/:pid', webhooksService.sendNotification);

module.exports = router;
