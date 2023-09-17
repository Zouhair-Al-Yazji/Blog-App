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
