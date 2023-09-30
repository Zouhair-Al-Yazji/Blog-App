'use strict';
const User = require('../models/User');
const Post = require('../models/Post');

exports.mustBeLoggedIn = function (req, res, next) {
	if (req.session.user) {
		next();
	} else {
		req.flash('errors', 'You must be logged in to perform this action.');
		req.session.save(() => res.redirect('/login'));
	}
};

exports.viewSettingsScreen = function (req, res) {
	res.render('pages/Settings');
};

exports.viewBookmarksScreen = function (req, res) {
	res.render('pages/BookmarksPage');
};

exports.viewNotificationsScreen = function (req, res) {
	res.render('pages/NotificationsPage');
};

exports.viewSearchScreen = function (req, res) {
	res.render('pages/SearchPage');
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
		res.render('pages/LoginPage', {
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
		res.render('pages/RegisterPage', {
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

exports.viewAccountScreen = (req, res) => {
	res.render('pages/AccountSettingsPage');
};

exports.viewProScreen = (req, res) => {
	res.render('pages/ProSettingsPage');
};

exports.search = function (req, res) {
	res.render('pages/SearchPage', { body: req.body.query });
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

exports.ifUserExists = function (req, res, next) {
	User.findByUsername(req.params.username)
		.then((userDocument) => {
			req.userProfile = userDocument;
			next();
		})
		.catch(() => {
			res.status(404).render('pages/404');
		});
};

exports.viewProfileScreen = function (req, res) {
	Post.findByAuthorId(req.userProfile._id)
		.then((posts) => {
			res.render('pages/profile', {
				posts: posts,
				profileUsername: req.userProfile.username,
				profileAvatar: req.userProfile.avatar,
				profileEmail: req.userProfile.email,
				profileJoinedDate: req.userProfile.joinedDate,
			});
		})
		.catch(() => {
			res.status(404).render('pages/404');
		});
};
