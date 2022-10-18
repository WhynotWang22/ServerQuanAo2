var createError = require('http-errors');
var express = require('express');
var bodyparser =require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose =require('mongoose');
var dotenv =require('dotenv');
dotenv.config();
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var proRouter = require('./routes/product')
var bannerRouter = require('./routes/banner');
var apiBannerRouter = require('./routes/api.banner');
var categoryRouter = require('./routes/cate');
var apiCategoryRouter = require('./routes/api.categorys');
var apiProductRouter = require('./routes/api.product');





var app = express();
//ket noi voi database
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("BD connection Successfull !"))
    .catch((err) => console.log(err));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(bodyparser.urlencoded({extended:true}))
app.use(logger('dev'));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products',proRouter);
app.use('/banners',bannerRouter);
app.use('/api/banners',apiBannerRouter);
app.use('/categorys',categoryRouter);
app.use('/api/categorys',apiCategoryRouter);
app.use('/api/products',apiProductRouter);





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

module.exports = app;
