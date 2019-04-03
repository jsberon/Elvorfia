var createError = require('http-errors');
var path = require('path');
var fs = require('fs');
var express = require('express');
var hbs = require('hbs');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var homeRouter = require('./app_elvorfia/routes/home');
var usersRouter = require('./app_elvorfia/routes/users');

var app = express();

// view engine setup
hbs.registerPartials(path.join(__dirname, 'app_elvorfia/views/partials'));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'app_elvorfia/views'));
app.set('view options', { layout: 'pt_elvorfia.hbs' });

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'app_elvorfia/static')));

app.use('/', homeRouter);
app.use('/home', homeRouter);
app.use('/users', usersRouter);

app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js'))); // redirect bootstrap JS
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist'))); // redirect JS jQuery
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css'))); // redirect CSS bootstrap

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
    res.render('error/error.hbs');
});

module.exports = app;
