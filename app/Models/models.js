var PostModel = require("./PostModel.js"),
	UserModel = require("./UserModel.js"),
	mongoose = require('mongoose');

/**
 * Exports common methods to use through models
 */


function connectMongo () {
	if (!Models.connected) {
		mongoose.connect('mongodb://localhost/sebastianteres');
		var db = mongoose.connection;
		db.on('error', console.error.bind(console, 'connection error:'));
		Models.connected = true;
	}
}

var Models = {
	connected : false,
	getPostModel: function() {
		connectMongo();
		return PostModel;
	},
	getUserModel : function() {
		connectMongo();
		return UserModel;
	},
	response: function(cb){
        return function(err, item) {
            if(!err) {
                cb(null, item);
            } else {
                cb(err, null);
            }
        };
    }
};

module.exports = Models;