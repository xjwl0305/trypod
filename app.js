const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const indexRouter = require('./routes/index');
const sequelize = require('./models').sequelize; // sequelize require
const config = require('./config');
const schedule = require("node-schedule");
const request = require("request-promise-native");

const app = express();
const corsOptions = {
    origin:  "http://localhost:3302",
    exposedHeaders: 'Report_title',
    credentials: true
}

app.use(cors(corsOptions));
sequelize.sync({ force: false }) // 서버 실행시마다 테이블을 재생성할건지에 대한 여부
    .then(() => {
      console.log('데이터베이스 연결 성공');
    })
    .catch((err) => {
      console.error(err);
    });


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(cors({
//     origin: 'http://localhost:3000',
//     methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
//     credentials: true,
// }));
app.use(express.static(path.join(__dirname, 'public')));


app.set('jwt-secret', config.secret);
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
