const passport = require('passport');
const express = require('express');
const orderService = require('../../services/orders/placeorder');
const viewService = require('../../services/orders/vieworder');
const updateService = require('../../services/orders/updateorder');
const cancelService = require('../../services/orders/cancelorder');
const manageOrderService = require('../../services/orders/manageorder');

const router = express.Router();

router.post('/place', passport.authenticate('jwt', { session: false }), orderService.placeOrder);
router.get('/view/pharmacy/:pid', passport.authenticate('jwt', { session: false }), viewService.pharmacyOrders);
router.get('/view/pharmacy/:pid/:oid', passport.authenticate('jwt', { session: false }), viewService.pharmacyOrders);
router.get('/view/patient/:oid', passport.authenticate('jwt', { session: false }), viewService.patientOrders);
router.get('/view/patient', passport.authenticate('jwt', { session: false }), viewService.patientOrders);
router.get('/view/products/:oid', passport.authenticate('jwt', { session: false }), viewService.orderProducts);
router.put('/update/:oid', passport.authenticate('jwt', { session: false }), updateService.updateOrder);
router.get('/activity/:oid', passport.authenticate('jwt', { session: false }), viewService.viewStatus);
router.post('/cancel', passport.authenticate('jwt', { session: false }), cancelService.cancelOrder);
router.post('/activity/set/:oid', passport.authenticate('jwt', { session: false }), manageOrderService.manageOrder);
module.exports = router;
