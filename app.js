'use strict';
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo');
const path = require('path');
const router = require('./routes/router');
const blogRouter = require('./routes/blogRouter');
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
	next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

// Serve the static JavaScript file using express.static
app.use('/blog/javascripts', express.static(path.join(__dirname, 'public/javascripts')));
app.use('/blog/stylesheets', express.static(path.join(__dirname, 'public/stylesheets')));
app.use('/blog/images', express.static(path.join(__dirname, 'public/images')));

app.use('/', router);
app.use('/blog', blogRouter);

module.exports = app;
