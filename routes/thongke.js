var express = require('express');
var router = express.Router();
const thongKeController = require('../controllers/thongke.controller');

router.get('/',thongKeController.getFormAdd);
//get day
router.get('/filterAmountByDay',thongKeController.getFilter);
//get week
router.get('/filterAmountByWeek',thongKeController.getFilterWeek);
//get month
router.get('/filterAmountByMonth',thongKeController.getDaysinmonht);
//get year (not done)
router.get('/filterAmountMonthtoYear',thongKeController.getFilterMonthtoYear);

router.get('/tong',thongKeController.getfilterIncome);





module.exports = router;
