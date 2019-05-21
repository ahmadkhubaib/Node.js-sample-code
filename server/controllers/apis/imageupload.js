const express = require('express');
const imageService = require('../../services/profile/imageupload');

const router = express.Router();

router.post('/', imageService.s3Sign);

module.exports = router;
