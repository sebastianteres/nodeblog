var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
    bcrypt = require('bcrypt')
    SALT_WORK_FACTOR = 10;

var UserSchema = new Schema({
    "name": { type: String, required: true },
    "email": { type: String, required: true, index: { unique: true } },
    "password": { type: String, required: true }
});

UserSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password along with our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

UserSchema.statics.login = function (email, password, cb) {
	this.findOne({email:email}, function(err, user){
		if (err) {
			cb(err, null);
		}
		if(user){
			user.comparePassword(password, function(err, isMatch) {
				if (err) {
					cb (err, null);
				} else if (!isMatch) {
					cb ("Incorrect Password", null);
				} else {
					cb (null, user);
				}
			});
		} else {
			cb("User not found", null);
		}
	});
};
var UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;