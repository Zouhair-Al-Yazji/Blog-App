const session = require("express-session");
const User = require("../models/User");

// GET METHODS
exports.resetpasswordPage = function (req, res) {
	res.render("./pages/ResetPasswordPage", { title: ": Express" });
};

exports.articleDetailPage = function (req, res) {
	res.render("./pages/ArticleDetailPage/ArticleDetailPage.ejs", { title: ": Express" });
};

exports.aboutPage = function (req, res) {
	res.render("./pages/AboutPage", { title: ": Express" });
};

exports.contactPage = function (req, res) {
	res.render("./pages/ContactPage", { title: ": Express" });
};

exports.faqsPage = function (req, res) {
	res.render("./pages/FAQ.ejs", { title: ": Express" });
};

exports.pricingPage = function (req, res) {
	res.render("./pages/pricingPage.ejs", { title: ": Express" });
};

exports.logout = function (req, res) {
	req.session.destroy(() => res.redirect("/"));
};

exports.login = async function (req, res) {
	let user = new User(req.body);

	user
		.login()
		.then((attemptedUser) => {
			req.session.user = { username: attemptedUser.username };
			req.session.save(() => res.redirect("/"));
		})
		.catch((err) => {
			req.flash("errors", err);
			req.session.save(() => res.redirect("/login"));
		});
};

exports.loginPage = function (req, res) {
	if (req.session.user) {
		res.redirect("/");
	} else {
		res.render("./pages/login/LoginPage", {
			title: ": Express",
			errors: req.flash("errors"),
		});
	}
};

exports.register = function (req, res) {
	let user = new User(req.body);
	user
		.register()
		.then(() => {
			req.session.user = { username: user.data.username };
			req.session.save(() => res.redirect("/"));
		})
		.catch(({ regErrors, regData }) => {
			regData.forEach((data) => {
				req.flash("regData", data);
			});

			regErrors.forEach((err) => {
				req.flash("regErrors", err);
			});
			req.session.save(() => res.redirect("/register"));
		});
};

exports.registerPage = function (req, res) {
	if (req.session.user) {
		res.redirect("/");
	} else {
		res.render("./pages/register/RegisterPage", {
			title: ": Express",
			regErrors: req.flash("regErrors"),
			regData: req.flash("regData"),
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
		res.render("./pages/HomeDashboard", {
			username: req.session.user.username,
		});
	} else {
		res.render("./pages/home/HomeGuest", { title: ": Express" });
	}
};
