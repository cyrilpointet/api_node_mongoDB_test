const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

// Routes
const indexRouter = require('./routes/index');
const productRouter = require('./routes/productRouter');
const usersRouter = require('./routes/userRouter');
const membersRouter = require('./routes/memberRouter');
const groupsRouter = require('./routes/groupRouter');

// DB
const mongodb = require('./db/mongo');
mongodb.initClientDbConnection();

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'resources/twig'));
app.set('view engine', 'twig');

app.use(cors({
    exposedHeaders: ['Authorization'],
    origin: '*'
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/product', productRouter);
app.use('/member', membersRouter);
app.use('/group', groupsRouter);
app.use(function(req, res, next) {
    res.status(404).json({name: 'API', version: '1.0', status: 404, message: 'not_found'});
});

module.exports = app;
