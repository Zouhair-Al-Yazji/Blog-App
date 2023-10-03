'use strict';
const usersCollection = require('../config/db').db().collection('users');
const validator = require('validator');
const ObjectId = require('mongodb').ObjectId;

class Profile {
	constructor(data, visitorId) {
		this.data = data;
		this.errors = [];
		this.visitorId = visitorId;
	}

	cleanUp() {
		if (!this.data.username && typeof this.data.username !== 'string') {
			this.data.username = '';
		}
		if (this.data.email && typeof this.data.email !== 'string') {
			this.data.email = '';
		}

		if (!this.data.fullName && typeof this.data.fullName !== 'string') {
			this.data.fullName = '';
		}

		if (!this.data.bio && typeof this.data.bio !== 'string') {
			this.data.bio = '';
		}

		if (!this.data.tagline && typeof this.data.tagline !== 'string') {
			this.data.tagline = '';
		}

		if (!this.data.location && typeof this.data.location !== 'string') {
			this.data.location = '';
		}

		if (!this.data.techStack && typeof this.data.techStack !== 'string') {
			this.data.techStack = '';
		}

		if (!this.data.availableFor && typeof this.data.availableFor !== 'string') {
			this.data.availableFor = '';
		}

		if (!this.data.twitter && typeof this.data.twitter !== 'string') {
			this.data.twitter = '';
		}

		if (!this.data.instagram && typeof this.data.instagram !== 'string') {
			this.data.instagram = '';
		}

		if (!this.data.github && typeof this.data.github !== 'string') {
			this.data.github = '';
		}

		if (!this.data.stackoverflow && typeof this.data.stackoverflow !== 'string') {
			this.data.stackoverflow = '';
		}

		if (!this.data.facebook && typeof this.data.facebook !== 'string') {
			this.data.facebook = '';
		}

		if (!this.data.website && typeof this.data.website !== 'string') {
			this.data.website = '';
		}

		if (!this.data.linkedin && typeof this.data.linkedin !== 'string') {
			this.data.linkedin = '';
		}

		if (!this.data.youtube && typeof this.data.youtube !== 'string') {
			this.data.youtube = '';
		}

		this.data = {
			fullName: this.data.fullName.trim(),
			tagline: this.data.tagline.trim(),
			location: this.data.location.trim(),
			bio: this.data.bio.trim(),
			techStack: this.data.techStack.trim(),
			availableFor: this.data.availableFor.trim(),
			twitter: this.data.twitter.trim(),
			instagram: this.data.instagram.trim(),
			github: this.data.github.trim(),
			stackoverflow: this.data.stackoverflow.trim(),
			facebook: this.data.facebook.trim(),
			website: this.data.website.trim(),
			linkedin: this.data.linkedin.trim(),
			youtube: this.data.youtube.trim(),
			username: this.data.username.trim().toLowerCase(),
			email: this.data.email.trim().toLowerCase(),
		};
	}

	getOriginalUsername() {
		return new Promise(async (resolve, reject) => {
			try {
				const userDocument = await usersCollection.findOne({ _id: new ObjectId(this.visitorId) });
				if (userDocument) {
					resolve(userDocument.username);
				} else {
					reject('No document found');
				}
			} catch (err) {
				reject(err);
			}
		});
	}

	getOriginalEmail() {
		return new Promise(async (resolve, reject) => {
			try {
				const userDocument = await usersCollection.findOne({ _id: new ObjectId(this.visitorId) });
				if (userDocument) {
					resolve(userDocument.email);
				} else {
					reject('No document found');
				}
			} catch (err) {
				reject(err);
			}
		});
	}

	validate() {
		return new Promise(async (resolve, reject) => {
			let originalUsername = await this.getOriginalUsername();
			let originalEmail = await this.getOriginalEmail();
			if (this.data.fullName === '') {
				this.errors.push('You must provide a name.');
			}

			if (this.data.fullName.length > 0 && this.data.fullName.length < 3) {
				this.errors.push('name must be at least 3 characters.');
			}

			if (this.data.fullName.length > 30) {
				this.errors.push('name cannot exceed 30 characters.');
			}

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

			if (this.data.tagline !== '' && this.data.tagline.length > 100) {
				this.errors.push('Tagline cannot exceed 100 characters.');
			}

			if (this.data.bio !== '' && this.data.bio.length > 300) {
				this.errors.push('Bio cannot exceed 300 characters.');
			}

			if (this.data.availableFor !== '' && this.data.availableFor.length > 140) {
				this.errors.push('Available for cannot exceed 140 characters.');
			}

			const twitterPattern = /(https?:\/\/twitter\.com\/(.+)|https?:\/\/www\.twitter\.com\/(.+))/;
			if (this.data.twitter !== '' && !this.data.twitter.match(twitterPattern)) {
				this.errors.push('Please provide a valid twitter URL.');
			}

			const instagramPattern =
				/(https?:\/\/instagram\.com\/(.+)|https?:\/\/www\.instagram\.com\/(.+))/;
			if (this.data.instagram !== '' && !this.data.instagram.match(instagramPattern)) {
				this.errors.push('Please provide a valid instagram URL.');
			}

			const githubPattern = /(https?:\/\/github\.com\/(.+)|https?:\/\/www\.github\.com\/(.+))/;
			if (this.data.github !== '' && !this.data.github.match(githubPattern)) {
				this.errors.push('Please provide a valid github URL.');
			}

			const stackoverflowPattern =
				/(https?:\/\/stackoverflow\.com\/(.+)|https?:\/\/www\.stackoverflow\.com\/(.+))/;
			if (this.data.stackoverflow !== '' && !this.data.stackoverflow.match(stackoverflowPattern)) {
				this.errors.push('Please provide a valid stackoverflow URL.');
			}

			const facebookPattern =
				/(https?:\/\/(www\.)?facebook\.com\/(.+)|https?:\/\/(www\.)?fb\.com\/(.+))/;
			if (this.data.facebook !== '' && !this.data.facebook.match(facebookPattern)) {
				this.errors.push('Please provide a valid facebook URL.');
			}

			const websitePattern = /(https?:\/\/)?(www\.)?[\w.-]+\.[a-z]{2,}(\/\S*)?/;
			if (this.data.website !== '' && !this.data.website.match(websitePattern)) {
				this.errors.push('Please provide a valid website URL.');
			}

			const linkedinPattern =
				/(https?:\/\/(www\.)?linkedin\.com\/in\/(.+)|https?:\/\/linkedin\.com\/company\/(.+))/;
			if (this.data.linkedin !== '' && !this.data.linkedin.match(linkedinPattern)) {
				this.errors.push('Please provide a valid linkedin URL.');
			}

			const youtubePattern =
				/(https?:\/\/(www\.)?youtube\.com\/channel\/(.+)|https?:\/\/youtube\.com\/c\/(.+)|https?:\/\/youtube\.com\/@([a-zA-Z0-9._-]+))/;
			if (this.data.youtube !== '' && !this.data.youtube.match(youtubePattern)) {
				this.errors.push('Please provide a valid youtube URL.');
			}

			// Only if username is valid then check to see if it's already taken
			if (this.data.username !== originalUsername) {
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
			}

			// Only if email is valid then check to see if it's already taken
			if (this.data.email !== originalEmail) {
				if (validator.isEmail(this.data.email)) {
					let emailExists = await usersCollection.findOne({
						email: this.data.email,
					});
					if (emailExists) {
						this.errors.push('That email is already being used.');
					}
				}
			}

			resolve();
		});
	}

	editProfile() {
		return new Promise(async (resolve, reject) => {
			// Step #1: Validate user data
			this.cleanUp();
			await this.validate();
			// Step #2: Only if there are no validation errors
			// then save the user data into a database
			if (this.errors.length > 0) {
				reject(this.errors);
				return;
			}

			try {
				const updatedUser = await usersCollection.findOneAndUpdate(
					{ username: this.data.username },
					{
						$set: {
							username: this.data.username,
							email: this.data.email,
							profile: {
								fullName: this.data.fullName,
								tagline: this.data.tagline,
								location: this.data.location,
								bio: this.data.bio,
								techStack: this.data.techStack,
								availableFor: this.data.availableFor,
								social: {
									twitter: this.data.twitter,
									instagram: this.data.instagram,
									github: this.data.github,
									stackoverflow: this.data.stackoverflow,
									facebook: this.data.facebook,
									website: this.data.website,
									linkedin: this.data.linkedin,
									youtube: this.data.youtube,
								},
							},
						},
					},
					{ returnOriginal: false } // To get the updated document
				);
				resolve(updatedUser);
			} catch (err) {
				// Handle database error gracefully and provide user-friendly feedback
				this.errors.push('An error occurred while updating the profile.');
				reject(this.errors);
			}
		});
	}
}

Profile.findUserById = function (id) {
	return new Promise(async (resolve, reject) => {
		try {
			let userProfile = await usersCollection.findOne({ _id: new ObjectId(id) });
			if (userProfile) {
				resolve(userProfile);
			} else {
				reject('User document empty');
			}
		} catch (err) {
			reject(err);
		}
	});
};

module.exports = Profile;
