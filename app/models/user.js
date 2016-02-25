var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var UserSchema = new Schema({
	name: {
		first: {type:String, require:true},
		last: {type:String, require:true}
	},
	role: [{
		nameRole: {type:String, require:true}
	}]
});

mongoose.model('User', UserSchema);