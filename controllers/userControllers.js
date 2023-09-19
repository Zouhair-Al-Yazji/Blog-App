'use strict';
const User = require('../models/User');

exports.mustBeLoggedIn = function (req, res, next) {
	if (req.session.user) {
		next();
	} else {
		req.flash('errors', 'You must be logged in to perform this action.');
		req.session.save(() => res.redirect('/'));
	}
};

exports.viewProfileScreen = function (req, res) {
	res.render('pages/profile', { title: 'Express' });
};

exports.resetpasswordPage = function (req, res) {
	res.render('pages/ResetPasswordPage', { title: ': Express' });
};

exports.aboutPage = function (req, res) {
	res.render('pages/AboutPage', { title: ': Express' });
};

exports.contactPage = function (req, res) {
	res.render('pages/ContactPage', { title: ': Express' });
};

exports.faqsPage = function (req, res) {
	res.render('pages/FAQ', { title: ': Express' });
};

exports.pricingPage = function (req, res) {
	res.render('pages/pricingPage', { title: ': Express' });
};

exports.logout = function (req, res) {
	req.session.destroy(() => res.redirect('/'));
};

exports.login = async function (req, res) {
	let user = new User(req.body);

	user
		.login()
		.then((attemptedUser) => {
			req.session.user = {
				username: attemptedUser.username,
				avatar: attemptedUser.avatar,
				email: attemptedUser.email,
				_id: attemptedUser._id,
			};
			req.session.save(() => res.redirect('/'));
		})
		.catch((err) => {
			req.flash('errors', err);
			req.session.save(() => res.redirect('/login'));
		});
};

exports.loginPage = function (req, res) {
	if (req.session.user) {
		res.redirect('/');
	} else {
		res.render('pages/login/LoginPage', {
			title: ': Express',
			errors: req.flash('errors'),
		});
	}
};

exports.register = function (req, res) {
	let user = new User(req.body);
	user
		.register()
		.then(() => {
			req.session.user = {
				username: user.data.username,
				avatar: user.avatar,
				_id: user.data._id,
				email: user.data.email,
			};
			req.session.save(() => res.redirect('/'));
		})
		.catch(({ regErrors, regData }) => {
			regData.forEach((data) => {
				req.flash('regData', data);
			});

			regErrors.forEach((err) => {
				req.flash('regErrors', err);
			});
			req.session.save(() => res.redirect('/register'));
		});
};

exports.registerPage = function (req, res) {
	if (req.session.user) {
		res.redirect('/');
	} else {
		res.render('pages/register/RegisterPage', {
			title: ': Express',
			regErrors: req.flash('regErrors'),
			regData: req.flash('regData'),
		});
	}
};

exports.contactForm = function (req, res) {
	res.send(`Thank you! Your message has been sent successfully. <br />
		name: ${req.body.name}, email: ${req.body.email}, phone: ${req.body.phone}, message: ${req.body.message}
	`);
};

exports.resetpassword = function (req, res) {
	res.send(`Resetpassword Form => ${req.body.email}`);
};

exports.search = function (req, res) {
	res.send(`Query Search => ${req.body.query}`);
};

exports.sendEmail = function (req, res) {
	res.send(`Send Email ${req.body.email}`);
};

exports.homePage = function (req, res) {
	if (req.session.user) {
		res.render('pages/HomeDashboard');
	} else {
		res.render('pages/home/HomeGuest', { title: ': Express' });
	}
};
