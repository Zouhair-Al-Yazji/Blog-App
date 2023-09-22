'use strict';
const postsCollection = require('../config/db').db().collection('posts');
const ObjectId = require('mongodb').ObjectId;
const validator = require('validator');

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

		if (typeof this.data.imgUrl !== 'string') {
			this.data.imgUrl = '';
		}

		if (typeof this.data.category !== 'string') {
			this.data.category = '';
		}

		if (typeof this.data.body !== 'string') {
			this.data.body = '';
		}

		// get rid of any bogus properties
		this.data = {
			title: this.data.title.trim(),
			imgUrl: this.data.imgUrl.trim(),
			category: this.data.category.trim(),
			readLength: this.data.readLength,
			body: this.data.body.trim(),
			createdDate: new Date(),
			author: new ObjectId(this.userId),
		};
	}

	validate() {
		if (this.data.title === '') {
			this.errors.push('You must provide a title.');
		}

		if (this.data.imgUrl === '') {
			this.errors.push('You must provide a image url.');
		}

		if (this.data.category === '') {
			this.errors.push('You must provide a category.');
		}
		if (this.data.readLength === '') {
			this.errors.push('You must provide a read length.');
		}

		if (!validator.isURL(this.data.imgUrl, { protocols: ['http', 'https'], require_tld: true })) {
			this.errors.push('You must provide a valid url.');
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
				postsCollection
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

		let posts = await postsCollection
			.aggregate([
				// find post
				{ $match: { _id: new ObjectId(id) } },
				// fond post author
				{
					$lookup: {
						from: 'users',
						localField: 'author',
						foreignField: '_id',
						as: 'authorDocument',
					},
				},
				// control properties
				{
					$project: {
						title: 1,
						imgUrl: 1,
						category: 1,
						readLength: 1,
						body: 1,
						createdDate: 1,
						author: { $arrayElemAt: ['$authorDocument', 0] },
					},
				},
			])
			.toArray();
		posts = posts.map((post) => {
			post.author = {
				username: post.author.username,
				avatar: post.author.avatar,
			};
			return post;
		});
		if (posts.length) {
			resolve(posts[0]);
		} else {
			reject();
		}
	});
};

module.exports = Post;
