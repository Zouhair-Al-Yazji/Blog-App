const bcrypt = require('bcryptjs');
const usersCollection = require('../config/db').db().collection('users');
const validator = require('validator');
const md5 = require('md5');

class User {
	constructor(data) {
		this.data = data;
		this.errors = [];
	}

	cleanUp() {
		if (typeof this.data.username !== 'string') {
			this.data.username = '';
		}

		if (typeof this.data.email !== 'string') {
			this.data.email = '';
		}

		if (typeof this.data.password !== 'string') {
			this.data.password = '';
		}

		// get rid of any bogus properties
		this.data = {
			username: this.data.username.trim().toLowerCase(),
			email: this.data.email.trim().toLowerCase(),
			password: this.data.password,
			confirmPassword: this.data.confirmPassword,
		};
	}

	validate() {
		return new Promise(async (resolve, reject) => {
			if (this.data.username === '') {
				this.errors.push('You must provide a username.');
			}

			if (this.data.username !== '' && !validator.isAlphanumeric(this.data.username)) {
				this.errors.push('Username can only contain letters and numbers.');
			}

			if (this.data.username.length > 0 && this.data.username.length < 3) {
				this.errors.push('Username must be at least 3 characters.');
			}

			if (this.data.username.length > 30) {
				this.errors.push('Username cannot exceed 30 characters.');
			}

			if (!validator.isEmail(this.data.email)) {
				this.errors.push('You must provide a valid email.');
			}

			if (this.data.password === '') {
				this.errors.push('You must provide a password.');
			}

			if (this.data.password.length > 0 && this.data.password.length < 12) {
				this.errors.push('Password must be at least 12 characters.');
			}

			if (this.data.password.length > 50) {
				this.errors.push('Password cannot exceed 50 characters.');
			}

			if (this.data.password !== this.data.confirmPassword) {
				this.errors.push('The password confirmation does not match.');
			}

			// Only if username is valid then check to see if it's already taken
			if (
				this.data.username.length > 2 &&
				this.data.username.length < 31 &&
				validator.isAlphanumeric(this.data.username)
			) {
				let usernameExists = await usersCollection.findOne({
					username: this.data.username,
				});
				if (usernameExists) {
					this.errors.push('That username is already taken.');
				}
			}
			// Only if email is valid then check to see if it's already taken
			if (validator.isEmail(this.data.email)) {
				let emailExists = await usersCollection.findOne({
					email: this.data.email,
				});
				if (emailExists) {
					this.errors.push('That email is already being used.');
				}
			}
			resolve();
		});
	}

	login() {
		return new Promise(async (resolve, reject) => {
			this.cleanUp();
			const attemptedUser = await usersCollection.findOne({
				email: this.data.email,
			});

			if (attemptedUser && bcrypt.compareSync(this.data.password, attemptedUser.password)) {
				this.getAvatar();
				resolve(attemptedUser);
			} else {
				reject('Invalid email / password.');
			}
		});
	}

	register() {
		return new Promise(async (resolve, reject) => {
			// Step #1: Validate user data
			this.cleanUp();
			await this.validate();
			// Step #2: Only if there are no validation errors
			// then save the user data into a database
			if (!this.errors.length) {
				this.getAvatar();
				this.data = {
					username: this.data.username.trim().toLowerCase(),
					email: this.data.email.trim().toLowerCase(),
					password: this.data.password,
					avatar: this.avatar,
					joinedDate: new Date(),
				};
				// Hash user password
				let salt = bcrypt.genSaltSync(10);
				this.data.password = bcrypt.hashSync(this.data.password, salt);
				usersCollection.insertOne(this.data);
				resolve();
			} else {
				this.regData = [];
				for (const key in this.data) {
					if (this.data.hasOwnProperty(key)) {
						this.regData.push({ name: key, value: this.data[key] });
					}
				}
				reject({ regErrors: this.errors, regData: this.regData });
			}
		});
	}

	getAvatar() {
		const emailHash = md5(this.data.email);
		this.avatar = `https://gravatar.com/avatar/${emailHash}/?s=128`;
	}
}

User.findByUsername = function (username, visitorId) {
	return new Promise((resolve, reject) => {
		if (typeof username !== 'string') {
			reject();
			return;
		}

		usersCollection
			.findOne({ username: username })
			.then((userDoc) => {
				if (userDoc) {
					userDoc = {
						_id: userDoc._id,
						username: userDoc.username,
						email: userDoc.email,
						avatar: userDoc.avatar,
						joinedDate: userDoc.joinedDate,
						isVisitorOwner: userDoc._id.equals(visitorId),
					};
					resolve(userDoc);
				} else {
					reject();
				}
			})
			.catch((err) => {
				reject(err);
			});
	});
};

module.exports = User;
