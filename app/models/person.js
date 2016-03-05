var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var PersonSchema = new Schema({
	name: {
		first: {type:String, require:true},
		last: {type:String, require:true}
	},
	age: Number
});

mongoose.model('Person', PersonSchema);