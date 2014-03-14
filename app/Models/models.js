/**
 * Exports common methods to use through models
 */

module.exports = {
	callback: function(cb){
        return function(err, item) {
            if(!err) {
                cb(null, item);
            } else {
                cb(err, null);
            }
        };
    }
};