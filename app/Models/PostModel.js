var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    toolbox = require("toolbox"),
    getSanitizingConverter = require("pagedown").getSanitizingConverter,
    saneConverter = getSanitizingConverter();

var PostSchema = new Schema({
    "title" : { type: String, required: true },
	"content" : { type: String, required: true },
	"author" : { type: String, default: "Sebastian Perez" },
	"createdAt" : { type: Date, default: Date.now },
	"updatedAt" : { type: Date, default: Date.now },
	"tags" : [{ type: String }],
	"picture" : String,
	"url" : { type: String }
});

PostSchema.pre('save', function(next) {
    var post = this;
    if (!post.isModified('url')) return next();
    post.url = createPostUrl(post);
    return next();
});

PostSchema.pre('save', function(next) {
    var post = this;
    if (!post.isModified('content')) return next();
    post.content = formatContent(post.content);
    return next();
});
/**
 * Find posts by tags, supports pagination.
 * @param  {Array} tags
 * @param  {int} page 
 * @param  {int} limit
 * @return {Array<Post>}
 */
PostSchema.statics.findByTags = function (tags, page, limit) {
	//TODO: implement
};

PostSchema.statics.getLastPosts = function (cb, limit, page) {
	var query = this.find({});
	query.limit(limit || 20);
	query.skip( (page - 1) * limit);
	query.exec(cb);
};

PostSchema.statics.getLastPostsPreview = function (cb, limit, page) {
	var query = this.find({});
	query.limit(limit || 20);
	query.skip( (page - 1) * limit);
	query.exec(cb);
};

PostSchema.statics.getLastPostsTitles = function (cb, limit, page) {
	var query = this.find({});
	query.limit(limit || 20);
	query.skip( (page - 1) * limit);
	query.select('title updatedAt');
	query.exec(cb);
};

var PostModel = mongoose.model('Post', PostSchema);

function createPostUrl (post) {

	return "http://www.sebastianteres.com/blog/post/" + post.title.toLowerCase().replace(/\s/g, '_') + toolbox.getUid(5);
}

function formatContent (content) {
	console.log(content);
	var result = saneConverter.makeHtml(content);
	console.log("RESULT");
	console.log(result);
	return result;
}

module.exports = {
	connected : false,
	getPostModel : function () {
		if (!this.connected) {
			mongoose.connect('mongodb://localhost/sebastianteres');
			var db = mongoose.connection;
			db.on('error', console.error.bind(console, 'connection error:'));
			this.connected = true;
		}
		return PostModel;
	}
};