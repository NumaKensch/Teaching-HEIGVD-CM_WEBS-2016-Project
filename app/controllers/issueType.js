var express = require('express'),
router = express.Router(),
mongoose = require('mongoose'),
IssueType =mongoose.model('IssueType');

module.exports = function (app) {
	app.use('/api/v1/issuesTypes', router);
};

//POST /api/v1/issuesTypes
//Add a type of issu
router.post('/', function (req, res, next){
	var issueType = new IssueType(req.body);

	issueType.save(function(err, createdIssueType){
		if (err) {
			res.status(500).send(err);
			return;
		}

		res.send(createdIssueType);
	});
});

//Get /api/v1/issueType
//get the list of all issueType
router.get('/', function(req, res, next){
	IssueType.find(function (err,issueType){
		if (err){
			res.status(500).send(err);
			return;
		}
	res.send(issueType);
	});
});


//DELETE /api/v1/issueType/:id
//Delete a issueType
router.delete('/:idIssueType', function(req, res, next){

	var idIssueType
	 = req.params.idIssueType;

	IssueType.remove({
		_id: idIssueType

	}, function(err, data){

		if(err){
			res.status(500).send(err);
			return;
		}
		console.log(data);

		console.log('Deleted' + data.n + 'documents');
		res.sendStatus(204);

	});
});


