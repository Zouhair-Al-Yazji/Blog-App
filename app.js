'use strict';
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo');
const path = require('path');
const router = require('./routes/router');
const app = express();

let sessionOptions = session({
	secret: 'Javascript Blog it is soo cool',
	resave: false,
	store: MongoStore.create({ client: require('./config/db') }),
	saveUninitialized: false,
	cookie: {
		maxAge: 1000 * 60 * 60 * 24,
		httpOnly: true,
	},
});

app.use(sessionOptions);
app.use(flash());

app.use((req, res, next) => {
	res.locals.user = req.session.user;
	res.locals.req = req;
	next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

app.use('/', router);

module.exports = app;
