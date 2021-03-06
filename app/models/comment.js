var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var CommentSchema = new Schema({
	issue: { type: Schema.Types.ObjectId, ref: 'Issue', required:true },
	author: { type: Schema.Types.ObjectId, ref: 'User', required:true },
	content: {type:String, require:true},
	date: {type:Date, require:true}
});

mongoose.model('Comment', CommentSchema);