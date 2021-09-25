const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require("express-session")

//  var bodyParser = require("body-parser");
const upload = require('express-fileupload');


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const ianShareRouter = require("./routes/ianShare")
const ianMeetRouter = require("./routes/ianMeet")
const ianWorkRouter = require("./routes/ianWork") 



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//	Gestion de l'upload
app.use(upload());



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//  Configuration de notre variable de session
app.use(session({secret: "ian_profile"}))


app.use(express.static(path.join(__dirname, 'public')));


//  Middleware poour la gestion des routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/ianShare", ianShareRouter);
app.use("/ianMeet", ianMeetRouter);
app.use("/ianWork", ianWorkRouter);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});



module.exports = app;