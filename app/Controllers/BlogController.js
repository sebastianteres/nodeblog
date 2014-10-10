var models = require ("../Models/models.js");

var viewHelpers = {
	getPostIcon : function (type) {
		switch (type) {
			case "tutorial" : return "wrench"; break;
			case "bookmark" : return "bookmark"; break;
			default: return "comment"; break;
		}
	}
};

module.exports = {
	home: function ( req, res ) {
		var page = req.query.page || 1,
			limit = req.query.limit || 10,
			tag = req.query.tag || null,
			error = false,
			errorMessage = null,
			message = null,
			posts = [];
		res.locals.viewHelpers = viewHelpers;
		res.locals.olderPosts = {
			display: false,
			page: 1
		};
		res.locals.newerPosts = {
			display: false,
			page: 1
		};
		function done() {
			res.locals.posts = posts;
			res.locals.error = error;
			res.locals.errorMessage = errorMessage;
			res.render("blog");
		}
		var PostModel = models.getPostModel();
		var params = {
				page: page,
				limit: limit
			},
			searchCriteria = {};
		if (tag) {
			searchCriteria.tags = new RegExp('^' + tag + '$', "i");
			res.locals.tag_filter = tag;
		}
		if (req.params.type)
			searchCriteria.type = new RegExp('^' + req.params.type + '$', "i");

		if (tag) {
			method = "findByTag";
		}
		PostModel.getLastPostsPreview(models.response(function (error, items) {
			if (!error) {
				posts = items;
				PostModel.count(searchCriteria, function (countError, count) {
					if (!countError) {
						if (count > page * limit) {
							//There are older posts
							res.locals.olderPosts.display = true;
							res.locals.olderPosts.page = parseInt(page, 10) + 1;
						}
						if (page > 1) {
							res.locals.newerPosts.display = true;
							res.locals.newerPosts.page = parseInt(page, 10) - 1;
						}
					} else {
						error = true;
						errorMessage = error;
					}
					done();
				});
			} else {
				error = true;
				errorMessage = error;
				done();
			}
		}), params, searchCriteria);

	},
	getPost: function (req, res) {
		res.locals.viewHelpers = viewHelpers;
		if (!req.params.url) {
			cb ("Wrong URL not specified");
		}
		models.getPostModel().getByUrl(models.response(function (error, post) {
			if(!error) {
				if (!post) {
					res.status(404).render('404');
				} else {
					console.log(post);
					res.locals.post = post;
					res.render("post");
				}
			} else {
				console.log(error);
				res.locals.error = true;
				res.locals.errorMessage = error;
				res.render("post");
			}
		}), req.params.url);
	}
};