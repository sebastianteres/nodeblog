var models = require ("./Models/models.js"),
    PostModelDelegate = require('./Models/PostModel.js');

Posts = {
	getHomePosts : function (cb, limit, page) {
		var PostModel = PostModelDelegate.getPostModel();
		if (PostModel) {
			PostModel.getLastPosts(models.callback(cb), limit || 20, page || 1);
		}
		
	},
	getAdminPosts : function (cb, limit, page) {
		var PostModel = PostModelDelegate.getPostModel();
		if (PostModel) {
			PostModel.getLastPostsTitles(models.callback(cb), limit || 20, page || 1);
		}
	},
	createPost : function (cb, data) {
		var PostModel = PostModelDelegate.getPostModel();
		if (PostModel) {
			var post = new PostModel(data);
			post.save(models.callback(cb));
		}
	},
	removePost : function (cb, id) {
		if (!id) {
			cb ("Id not specified");
		}
		var PostModel = PostModelDelegate.getPostModel();
		if (PostModel) {
			PostModel.remove({"_id" : id}, models.callback(cb));
		}
	}
};

module.exports = Posts;