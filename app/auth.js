var models = require ("./Models/models.js");

module.exports = {
	findUser: function (id, cb) {
		models.getUserModel().findById(id, cb);
	},
	authenticateUser : function (username, password, cb) {
		models.getUserModel().login(username, password, function(error, user){
			cb(error, user);
		});
	},
	allowRegister: function(cb) {
		console.log("looking for users");
		models.getUserModel().count(function(error, count) {
			if (count < 1) {
				cb(true);
			} else {
				cb(false);
			}
		});
	}
};