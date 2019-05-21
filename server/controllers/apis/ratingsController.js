const passport = require('passport');
const express = require('express');
const ratingsService = require('../../services/ratings/ratingshandler');

const router = express.Router();

router.post('/create', passport.authenticate('jwt', { session: false }), ratingsService.createRating);
router.post('/update', passport.authenticate('jwt', { session: false }), ratingsService.updateRating);
router.post('/addfavorite', passport.authenticate('jwt', { session: false }), ratingsService.addToFavs);

module.exports = router;
