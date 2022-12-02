var express = require('express');
var router = express.Router();
const apiNoti = require('../controllers/api.notification.controller');
const multer =require('multer');
const auth = require("../middleware/api.auth.middleware");
const upload =multer();

// router.get('/getall',apiNoti.getAllNoti);
router.get('/getAll',auth, apiNoti.getAllNoti);

module.exports = router;
