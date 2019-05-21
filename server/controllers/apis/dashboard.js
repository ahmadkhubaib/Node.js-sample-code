const passport = require('passport');
const express = require('express');
const dashboardService = require('../../services/dashboard/dashboard');

const router = express.Router();

router.post('/analytics/orders/:pid', passport.authenticate('jwt', { session: false }), dashboardService.getAnalytics);

module.exports = router;
