var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var CommentSchema = new Schema({
	content: {type:String, require:true},
	date: {type:Date, require:true}
});

mongoose.model('Comment', CommentSchema);