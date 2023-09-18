'use strict';
let postCollection = require('../config/db').db().collection('posts');
let ObjectId = require('mongodb').ObjectId;

class Post {
	constructor(data, userId) {
		this.data = data;
		this.errors = [];
		this.userId = userId;
	}

	cleanUp() {
		if (typeof this.data.title !== 'string') {
			this.data.title = '';
		}

		if (typeof this.data.body !== 'string') {
			this.data.body = '';
		}

		// get rid of any bogus properties
		this.data = {
			title: this.data.title.trim(),
			body: this.data.body.trim(),
			createdDate: new Date(),
			author: new ObjectId(this.userId),
		};
	}

	validate() {
		if (this.data.title === '') {
			this.errors.push('You must provide a title.');
		}

		if (this.data.body === '') {
			this.errors.push('You must provide a post content.');
		}
	}

	createPost() {
		return new Promise((resolve, reject) => {
			this.cleanUp();
			this.validate();
			if (!this.errors.length) {
				postCollection
					.insertOne(this.data)
					.then(() => {
						resolve();
					})
					.catch((error) => {
						this.errors.push(`Please try again later, ${error}.`);
						reject(this.errors);
					});
			} else {
				reject(this.errors);
			}
		});
	}
}

Post.findSingleById = function (id) {
	return new Promise(async (resolve, reject) => {
		if (typeof id !== 'string' || !ObjectId.isValid(id)) {
			reject();
			return;
		}

		let post = await postCollection.findOne({ _id: new ObjectId(id) });
		if (post) {
			resolve(post);
		} else {
			reject();
		}
	});
};

module.exports = Post;
