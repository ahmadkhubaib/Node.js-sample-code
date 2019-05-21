
const express = require('express');

const suregisterController = require('../../controllers/apis/suregister');
const suloginController = require('../../controllers/apis/sulogin');
const addmedicinesController = require('../../controllers/apis/medicinesController');
const registerController = require('../../controllers/apis/register');
const loginController = require('../../controllers/apis/login');
const dashboardController = require('../../controllers/apis/dashboard');
const createProfileController = require('../../controllers/apis/createprofile');
const addPharmacistController = require('../../controllers/apis/pharmacistController');
const addressController = require('../../controllers/apis/addressController');
const requestdataController = require('../../controllers/apis/requestdata');
const deletedataController = require('../../controllers/apis/deletedata');
const qrController = require('../../controllers/apis/qr');
const storeController = require('../../controllers/apis/store');
const orderController = require('../../controllers/apis/order');
const verificationController = require('../../controllers/apis/verification');
const profileController = require('../../controllers/apis/profileController');
const blacklistController = require('../../controllers/apis/blacklist');
const imgaeuploadController = require('../../controllers/apis/imageupload');
const conversationController = require('../../controllers/apis/conversationController');
const forgetController = require('../../controllers/apis/forgetpassword');
const paymentController = require('../../controllers/apis/stripeController');
const ratingsController = require('../../controllers/apis/ratingsController');
const webhooksController = require('../../controllers/apis/webhooksController');

const router = express.Router();


router.use('/suregister', suregisterController);
router.use('/sulogin', suloginController);
router.use('/addmedicines', addmedicinesController);
router.use('/signup', registerController);
router.use('/login', loginController);
router.use('/dashboard', dashboardController);
router.use('/createprofile', createProfileController);
router.use('/addpharmacist', addPharmacistController);
router.use('/store', storeController);
router.use('/address', addressController);
router.use('/requestdata', requestdataController);
router.use('/deletedata', deletedataController);
router.use('/genqr', qrController);
router.use('/orders', orderController);
router.use('/verify', verificationController);
router.use('/profile', profileController);
router.use('/tokenblacklist', blacklistController);
router.use('/upload', imgaeuploadController);
router.use('/conversation', conversationController);
router.use('/forget', forgetController);
router.use('/payments', paymentController);
router.use('/rate', ratingsController);
router.use('/webhooks', webhooksController);

// eslint-disable-next-line no-undef
getToken = (headers) => {
	if (headers && headers.authorization) {
		const parted = headers.authorization.split(' ');
		if (parted.length === 2) {
			return parted[1];
		}
			return null;
	}
		return null;
};

module.exports = router;
