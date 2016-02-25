var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var UserSchema = new Schema({
	name: {
		first: {type:String, require:true},
		last: {type:String, require:true}
	},
	role: [String]
});

mongoose.model('User', UserSchema);