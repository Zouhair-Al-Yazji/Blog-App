'use strict';
const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/userControllers');
const postControllers = require('../controllers/postControllers');

// user routes
router.get('/', userControllers.homePage);
router.get('/register', userControllers.registerPage);
router.get('/login', userControllers.loginPage);
router.get('/resetpassword', userControllers.resetpasswordPage);
router.get('/about', userControllers.aboutPage);
router.get('/contact', userControllers.contactPage);
router.get('/faqs', userControllers.faqsPage);
router.get('/pricing', userControllers.pricingPage);
router.get('/my-profile', userControllers.mustBeLoggedIn, userControllers.viewProfileScreen);
router.get('/settings', userControllers.mustBeLoggedIn, userControllers.viewSettingsScreen);
router.get('/bookmarks', userControllers.mustBeLoggedIn, userControllers.viewBookmarksScreen);
router.get(
	'/notifications',
	userControllers.mustBeLoggedIn,
	userControllers.viewNotificationsScreen
);
router.get('/search', userControllers.viewSearchScreen);

router.post('/login', userControllers.login);
router.post('/register', userControllers.register);
router.post('/resetpassword', userControllers.resetpassword);
router.post('/logout', userControllers.logout);
router.post('/search', userControllers.search);
router.post('/sendEmail', userControllers.sendEmail);
router.post('/contact', userControllers.contactForm);

// post routes
router.get('/create-post', userControllers.mustBeLoggedIn, postControllers.viewCreatePostScreen);
router.post('/create-post', userControllers.mustBeLoggedIn, postControllers.createPost);
router.get('/blog/:id', postControllers.viewSingle);

module.exports = router;
