var express = require('express');

var ProC = require('../controllers/product.controller');
const uploadC = require('../controllers/upload.controller');

var router = express.Router();
var multer = require('multer');
const upload = multer({dest:'./tmp/'})

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
})

router.get('/list',ProC.getListProduct);
router.get('/add',ProC.getFormAddPro);
router.post('/add',upload.single("img"), ProC.postAddPro);
router.get('/edit/:id',ProC.getFormEditPro);
router.post('/edit/:id',ProC.postEditPro);
router.get('/del/:id',ProC.postDelPro);


router.get('/upload/:id',uploadC.getFormUpload);

router.post('/upload/:id',upload.array('anh_product',10),uploadC.postUpload);





module.exports = router;