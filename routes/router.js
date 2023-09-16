"use strict";
const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/userControllers");

router.get("/", userControllers.homePage);
router.get("/register", userControllers.registerPage);
router.get("/login", userControllers.loginPage);
router.get("/resetpassword", userControllers.resetpasswordPage);
router.get("/about", userControllers.aboutPage);
router.get("/contact", userControllers.contactPage);
router.get("/faqs", userControllers.faqsPage);
router.get("/pricing", userControllers.pricingPage);

router.post("/login", userControllers.login);
router.post("/register", userControllers.register);
router.post("/resetpassword", userControllers.resetpassword);
router.post("/logout", userControllers.logout);
router.post("/search", userControllers.search);
router.post("/sendEmail", userControllers.sendEmail);
router.post("/contact", userControllers.contactForm);

module.exports = router;
