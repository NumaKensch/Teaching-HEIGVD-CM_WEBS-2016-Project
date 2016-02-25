var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var IssueSchema = new Schema({
	author: { type: Schema.Types.ObjectId, ref: 'User', required:true },
	description: { type:String, required:true },
	coordinate: {
		{ type:Number, required:true }, 
		{ type:Number, required:true }
	},
	status: { type:String, required:true },
	action: [
		{
			staffId: { type: Schema.Types.ObjectId, ref: 'User', required:true },
			date: { type:Date, required:true},
			description: { type:String, required:true}
		}
	],
	keyWords: [
		{
			word: { type:String, required:false}
		} 
	]
});

mongoose.model('Issue', IssueSchema);