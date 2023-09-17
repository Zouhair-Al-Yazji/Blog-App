'use strict';
const Post = require('../models/Post');

exports.viewCreatePostScreen = function (req, res) {
	res.render('pages/create-post');
};

exports.createPost = function (req, res) {
	let post = new Post(req.body, req.session.user._id);
	post
		.createPost()
		.then(() => {
			res.send('post created.');
		})
		.catch((err) => {
			res.send(err);
		});
};

exports.viewSingle = function (req, res) {
	res.render('pages/ArticleDetailPage/ArticleDetailPage', { title: ': Express' });
};
