var Posts = require("./Posts.js");

var routes = {
	blogHome: function (req, res) {
		Posts.getHomePosts(function(error, items) {
			if (!error) {
				res.locals.posts = items;
				res.locals.getPostStyle = function(index) {
					index++;
					switch (index % 4) {
						case 0:
							return "cs-bg-main cs-txt-lighter";
						case 1: 
							return "cs-bg-dark cs-txt-lighter";
						case 2:
							return "cs-bg-light cs-txt-darker";
						case 3:
							return "cs-bg-lighter cs-txt-darker";
					}
					return "";
				}
				res.render("blog");
			} else {
				console.log(error);
				app.locals.posts = [];
				res.locals.error = true;
				res.locals.errorMessage = error;
				res.render("blog");
			}
		});
	},
	blogAdmin: function (req, res) {
		Posts.getAdminPosts(function(error, items) {
			if (!error) {
				res.locals.posts = items;
				res.render("admin");
			} else {
				console.log(error);
				res.locals.posts = [];
				res.locals.error = true;
				res.locals.errorMessage = error;
				res.render("admin");
			}
		}, 10, req.body.page || 1);
	},
	createPost : function (req, res) {
		var data = {
			title: req.body.title,
			content: req.body.content
		};
		//TODO: Check credentials
		Posts.createPost(function(error) {
			if(!error) {
				//redirect to admin
				res.locals.message = "Post created successfully!";
				routes.blogAdmin(req, res);
			} else {
				console.log(error);
				res.locals.posts = [];
				res.locals.error = true;
				res.locals.errorMessage = error;
				routes.blogAdmin(req, res);
			}
		}, data);
	},
	removePost : function (req, res) {
		Posts.removePost(function(error){
			if(!error) {
				//redirect to admin
				res.locals.message = "Post deleted successfully!";
				routes.blogAdmin(req, res);
			} else {
				console.log(error);
				res.locals.error = true;
				res.locals.errorMessage = error;
				routes.blogAdmin(req, res);
			}
		}, req.body.id);
	}
};

module.exports = routes;