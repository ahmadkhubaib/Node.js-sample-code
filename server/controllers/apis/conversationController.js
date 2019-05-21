const passport = require('passport');
const express = require('express');
const chatService = require('../../services/orders/conversation/conversation');

const router = express.Router();

router.post('/create', passport.authenticate('jwt', { session: false }), chatService.createChat);
router.post('/read', passport.authenticate('jwt', { session: false }), chatService.readChat);
router.post('/create/external', passport.authenticate('jwt', { session: false }), chatService.createExternalChat);
router.post('/read/external', passport.authenticate('jwt', { session: false }), chatService.readExternalChat);
router.post('/read/single/external', passport.authenticate('jwt', { session: false }), chatService.getMessage);
// router.all('*', chatService.sendNotification);

module.exports = router;
