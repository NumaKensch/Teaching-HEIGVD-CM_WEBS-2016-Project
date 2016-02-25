var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var IssueTypeSchema = new Schema({
	nameShort: {type:String, require:true},
	description: {type:String, require:true}
});

mongoose.model('IssueType', IssueTypeSchema);