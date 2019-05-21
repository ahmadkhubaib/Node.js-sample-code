const passport = require('passport');
const express = require('express');
const chatService = require('../../services/orders/conversation/conversation');

const router = express.Router();

router.post('/create', passport.authenticate('jwt', { session: false }), chatService.createChat);
router.post('/read', passport.authenticate('jwt', { session: false }), chatService.readChat);

module.exports = router;
