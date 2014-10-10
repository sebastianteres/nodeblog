var models = require ("../Models/models.js");

var Controller = {
	renderView: function (req, res) {
		//TODO: Check credentials
		models.getPostModel().getLastPostsTitles(function(error, items){
			if (!error) {
				res.locals.posts = items;
				res.render("admin", {user: req.user});
			} else {
				console.log(error);
				res.locals.posts = [];
				res.locals.error = true;
				res.locals.errorMessage = error;
				res.render("admin");
			}
		}, 0, req.body.page || 1);

	},
	create : function (req, res) {
		var data = {
			title: req.body.title,
			markdown: req.body.markdown,
			picture: req.body.picture,
			summary: req.body.summary,
			type: req.body.type,
			tags: req.body.tags.split(",")
		};
		var PostModel = models.getPostModel();
		var post = new PostModel(data);
		post.save(function(error){
			if(!error) {
				//redirect to admin
				res.locals.message = "Post created successfully!";
				Controller.renderView(req, res);
			} else {
				console.log(error);
				res.locals.posts = [];
				res.locals.error = true;
				res.locals.errorMessage = error;
				Controller.renderView(req, res);
			}
		});
	},
	remove : function (req, res) {
		models.getPostModel().findByIdAndRemove(req.body.id, function(error, items){
			if(!error) {
				//redirect to admin
				res.locals.message = "Post deleted successfully!";
				Controller.renderView(req, res);
			} else {
				console.log(error);
				res.locals.error = true;
				res.locals.errorMessage = error;
				Controller.renderView(req, res);
			}
		});
	},
	edit : function (req, res) {
		models.getPostModel().findById(req.params.id, function(error, post){
			if(!error) {
				res.locals.editing = true;
				res.locals.post = post;
				Controller.renderView(req, res);
			} else {
				console.log(error);
				res.locals.error = true;
				res.locals.errorMessage = error;
				Controller.renderView(req, res);
			}
		});
	},
	update : function (req, res) {
		var id = req.params.id;
		var data = {
			title: req.body.title,
			markdown: req.body.markdown,
			picture: req.body.picture,
			summary: req.body.summary,
			type: req.body.type,
			tags: req.body.tags.split(",")
		};
		var error = false,
			errorMessage = "",
			message = "";
		function done () {
			res.locals.message = message;
			res.locals.error = error;
			res.locals.errorMessage = errorMessage;
			Controller.renderView(req, res);
		}
		models.getPostModel().findById(id, function(err, post){
			
			if(!err) {
				if (!post) {
					error = true;
					errorMessage = "Post not found";
					done();
				} else {
					post.title = req.body.title;
					post.markdown = req.body.markdown;
					post.picture = req.body.picture;
					post.summary = req.body.summary;
					post.type = req.body.type;
					post.tags = req.body.tags.split(",");
					post.save(function(saveError){
						if(!saveError) {
							message = "Post updated.";
						} else {
							error = true;
							errorMessage = saveError;
						}
						done();
					});
				}
			} else {
				error = true;
				errorMessage = err;
				done();
			}
		});
	},
	register : function (req, res) {
		var UserModel = models.getUserModel();
		var user = new UserModel({
			name: req.body.name,
			email: req.body.email,
			password: req.body.password
		});
		user.save(function(error, createdUser){
			if(!error) {
				//redirect to admin
				res.locals.user = createdUser;
				res.redirect("/admin");
			} else {
				console.log(error);
				req.session.posts = [];
				req.session.error = true;
				req.session.errorMessage = error;
				res.redirect("/login");
			}
		});

	}
};

module.exports = Controller;