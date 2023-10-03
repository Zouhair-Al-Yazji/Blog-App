'use strict';
const User = require('../models/User');
const Post = require('../models/Post');
const Profile = require('../models/Profile');

exports.mustBeLoggedIn = function (req, res, next) {
	if (req.session.user) {
		next();
	} else {
		req.flash('errors', 'You must be logged in to perform this action.');
		req.session.save(() => res.redirect('/login'));
	}
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
			console.log(user);
			req.session.user = {
				_id: user.data._id,
				username: user.data.username,
				avatar: user.avatar,
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
	User.findByUsername(req.params.username, req.visitorId)
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
			res.render('pages/profile-page', {
				posts: posts,
				profileUsername: req.userProfile.username,
				profileAvatar: req.userProfile.avatar,
				profileEmail: req.userProfile.email,
				profileJoinedDate: req.userProfile.joinedDate,
				isProfileOwner: req.userProfile.isVisitorOwner,
				profileFullName: req.userProfile.profile.fullName,
				profileTagline: req.userProfile.profile.tagline,
				profileLocation: req.userProfile.profile.location,
				profileBio: req.userProfile.profile.bio,
				profileTechStack: req.userProfile.profile.techStack,
				profileAvailableFor: req.userProfile.profile.availableFor,
				profileTwitter: req.userProfile.profile.social.twitter,
				profileLinkedin: req.userProfile.profile.social.linkedin,
				profileStackOverflow: req.userProfile.profile.social.stackoverflow,
				profileGithub: req.userProfile.profile.social.github,
				profileWebsite: req.userProfile.profile.social.website,
				profileFacebook: req.userProfile.profile.social.facebook,
				profileYoutube: req.userProfile.profile.social.youtube,
				profileInstagram: req.userProfile.profile.social.instagram,
			});
		})
		.catch(() => {
			res.status(404).render('pages/404');
		});
};

exports.viewSettingsScreen = function (req, res) {
	Profile.findUserById(req.visitorId)
		.then((userProfile) => {
			console.log();
			res.render('pages/Settings', {
				profileErrors: req.flash('profileErrors'),
				profileUsername: userProfile.username,
				profileEmail: userProfile.email,
				profileFullName: userProfile.profile.fullName,
				profileTagline: userProfile.profile.tagline,
				profileLocation: userProfile.profile.location,
				profileBio: userProfile.profile.bio,
				profileTechStack: userProfile.profile.techStack,
				profileAvailableFor: userProfile.profile.availableFor,
				profileTwitter: userProfile.profile.social.twitter,
				profileLinkedin: userProfile.profile.social.linkedin,
				profileStackOverflow: userProfile.profile.social.stackoverflow,
				profileGithub: userProfile.profile.social.github,
				profileWebsite: userProfile.profile.social.website,
				profileFacebook: userProfile.profile.social.facebook,
				profileYoutube: userProfile.profile.social.youtube,
				profileInstagram: userProfile.profile.social.instagram,
			});
		})
		.catch(() => {
			res.status(404).render('pages/404');
		});
};

exports.updateProfileScreen = function (req, res) {
	let profile = new Profile(req.body, req.visitorId);
	profile
		.editProfile()
		.then(() => {
			res.redirect('/settings');
		})
		.catch((err) => {
			req.flash('profileErrors', err);
			req.session.save(() => res.redirect('/settings'));
		});
};

exports.viewReportScreen = function (req, res) {
	res.render('pages/ReportPage');
};
