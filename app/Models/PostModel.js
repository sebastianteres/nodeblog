var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    toolbox = require("toolbox"),
    getSanitizingConverter = require("pagedown").getSanitizingConverter,
    saneConverter = getSanitizingConverter();

var PostSchema = new Schema({
    "title" : { type: String, required: true },
	"content" : { type: String },
	"markdown" : { type: String, required: true },
	"author" : { type: String, default: "Sebastian Perez" },
	"createdAt" : { type: Date, default: Date.now },
	"updatedAt" : { type: Date, default: Date.now },
	"tags" : [{ type: String }],
	"picture" : String,
	"url" : { type: String },
	"summary" : { type : String, required: true },
	"type" : {type: String, default: "tutorial"}
});

//Handle UpdatedAt
PostSchema.pre('save', function(next) {
    var post = this;
    post.updatedAt = Date.now();
    return next();
});

//Creates post URL
PostSchema.pre('save', function(next) {
    var post = this;
    if (!post.url){
	    post.url = encodeURIComponent(post.title.toLowerCase().replace(/\s/g, '_')) + "__" + toolbox.getUid(5);
	}
    return next();
});

//Transforms Markdown to HTML
PostSchema.pre('save', function(next) {
    var post = this;
    if (!post.isModified('markdown')) return next();
    post.content = saneConverter.makeHtml(post.markdown);
    return next();
});

//Trim tags
PostSchema.pre('save', function(next) {
    var post = this;
    if (!post.isModified('tags')) return next();
    post.tags = post.tags.map(function(tag) {
    	return tag.trim();
    });
    return next();
});

/**
 * Find posts by tags, supports pagination.
 * @param  {Array} tags
 * @param  {int} page 
 * @param  {int} limit
 * @return {Array<Post>}
 */
PostSchema.statics.findByTag = function (cb, params) {
	var query = this.find({"tags": new RegExp('^' + params.tag + '$', "i")});
	if ( params.limit !== 0 ) {
		query.limit(params.limit);
		query.skip( (params.page - 1) * params.limit);
	}
	query.sort('-updatedAt');
	query.select('title summary updatedAt url type tags');
	query.exec(cb);
};

PostSchema.statics.getLastPosts = function (cb, params) {
	var query = this.find({});
	if ( params.limit !== 0 ) {
		query.limit(params.limit);
		query.skip( (params.page - 1) * params.limit);
	}
	query.sort('-updatedAt');
	query.exec(cb);
};

PostSchema.statics.getLastPostsPreview = function (cb, params, searchCriteria) {
	var query = this.find(searchCriteria);
	if ( params.limit !== 0 ) {
		query.limit(params.limit);
		query.skip( (params.page - 1) * params.limit);
	}
	query.sort('-updatedAt');
	query.select('title summary updatedAt url type tags');
	query.exec(cb);
};

PostSchema.statics.getLastPostsTitles = function (cb, params) {
	var query = this.find({});
	if ( params.limit !== 0 ) {
		query.limit(params.limit);
		query.skip( (params.page - 1) * params.limit);
	}
	query.sort('-updatedAt');
	query.select('title updatedAt url');
	query.exec(cb);
};

PostSchema.statics.getByUrl = function (cb, url) {
	this.findOne({ "url": url }, cb);
};

PostSchema.statics.searchPost = function (value, cb, params) {
	var query = this.find();
	if ( params.limit !== 0 ) {
		query.limit(params.limit);
		query.skip( (params.page - 1) * params.limit);
	}
	query.sort('-updatedAt');
	query.select('title summary updatedAt url type tags');
	query.exec(cb);
};

var PostModel = mongoose.model('Post', PostSchema);


module.exports = PostModel;