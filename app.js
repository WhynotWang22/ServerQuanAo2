var createError = require('http-errors');
var express = require('express');
var bodyparser =require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose =require('mongoose');
var dotenv =require('dotenv');
var multer =require('multer');
var session = require('express-session');
dotenv.config();
//web router
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var proRouter = require('./routes/product');
var bannerRouter = require('./routes/banner');
var cateRouter =require('./routes/cate');
var thongkeRouter =require('./routes/thongke');
var OroderRouter =require('./routes/order');
var CommentRouter =require('./routes/Comment');
//api router
var apiAuthRouter =require('./routes/api.auth');
var apiBannerRouter = require('./routes/api.banner');
var apiCategoryRouter = require('./routes/api.categorys');
var apiProductRouter = require('./routes/api.product');
var apiCartRouter =require('./routes/api.cart');
var apiCommentRouter =require('./routes/api.comment');
var apiOrderRouter =require('./routes/api.order');
var notiRouter =require('./routes/noti');
var apiNotiRouter =require('./routes/api.noti');
var apiAddressRouter =require('./routes/api.address');
const {layouts} = require("chart.js");


var app = express();
//ket noi voi database
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("BD connection Successfull !"))
    .catch((err) => console.log(err));
//session
app.use(session({
  secret:'fksdfn24235bdInfsdHSNF9999',
  resave:true,
  saveUninitialized:true,
}))
//cloudinary

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs')
app.use(bodyparser.urlencoded({extended:true}))
app.use(logger('dev'));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// web router
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/pro',proRouter);
app.use('/banners',bannerRouter);
app.use('/cate',cateRouter);
app.use('/comment',CommentRouter);
app.use('/order',OroderRouter);
app.use('/thongke',thongkeRouter);
//api router
app.use('/api/auth',apiAuthRouter);
app.use('/api/banners',apiBannerRouter);
app.use('/api/categorys',apiCategoryRouter);
app.use('/api/products',apiProductRouter);
app.use('/api/cart',apiCartRouter);
app.use('/api/comment',apiCommentRouter);
app.use('/api/order',apiOrderRouter);
app.use('/api/address',apiAddressRouter);
app.use('/notification',notiRouter);
app.use('/api/notification',apiNotiRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
//handel err multer
function errhandler(err,req,res,next){
  if (err instanceof multer.MulterError){
    res.status(400).json({
      status:false,
      message:err.message
    })
  }
}
app.use(errhandler);

module.exports = app;