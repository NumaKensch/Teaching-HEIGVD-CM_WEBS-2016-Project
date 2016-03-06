var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var IssueSchema = new Schema({
	author: { type: Schema.Types.ObjectId, ref: 'User', required:true },
	description: { type:String, required:true },
	place : { type:String, required:true },
	picture : { type:String, required:true },
	coordinate: {
		type: { type:String, required:true }, 
		coordinates: [{ type:Number, required:true }]
	},
	issueType: 
		{
			issueTypeId: { type: Schema.Types.ObjectId, ref: 'IssueType', required:true },
			type: { type:String, required:true }
		},
	status: { type:String, required:true },
	action: [
		{
			staffId: { type: Schema.Types.ObjectId, ref: 'User', required:true },
			date: { type:Date, required:true },
			description: { type:String, required:true}
		}
	],
	date: { type:Date, required:true },
	keyWords: [
		{
			word: { type:String, required:false}
		} 
	]
});

IssueSchema.index({
	location: '2dsphere'
});

mongoose.model('Issue', IssueSchema);