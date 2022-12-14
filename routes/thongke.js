var express = require('express');
var router = express.Router();
const thongKeController = require('../controllers/thongke.controller');
const authC = require("../middleware/auth.middleware");

router.get('/',authC.YeuCauDangNhap,thongKeController.getFormAdd);
//get day
router.get('/filterAmountByDay',thongKeController.getFilter);
//get week
router.get('/filterAmountByWeek',thongKeController.getFilterWeek);
//get month
router.get('/filterAmountByMonth',thongKeController.getDaysinmonht);
//get year (not done)
router.get('/filterAmountMonthtoYear',thongKeController.getMonthsInYear);
//get chose Date Data
router.post('/filterByDatePicker',thongKeController.getChoseDate);





module.exports = router;
