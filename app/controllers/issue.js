var express = require('express'),
router = express.Router(),
mongoose = require('mongoose'),
Issue =mongoose.model('Issue');

module.exports = function (app) {
	app.use('/api/v1/issues', router);
};

//Post /api/issues
router.post('/', function (req, res, next){
	var issue = new Issue(req.body);

	issue.save(function(err, createdIssue){
		if (err) {
			res.status(500).send(err);
			return;
		}

		res.send(createdIssue);
	});
});

//Get /api/issues
router.get('/', function(req, res, next){
	Issue.find(function (err,issue){
		if (err){
			res.status(500).send(err);
			return;
		}
	res.send(issue);
	});
});

//Get /api/issues selon ID
router.get('/:id', function(req, res, next){
	var issueId = req.params.id;

	Issue.findById(issueId, function(err, issue){
		if(err){
			res.status(500).send(err);
			return;
		} else if (!issue){
			res.status(404).send('Issue not found');
			return;
		}
		res.send(issue);
	});
});

//DELETE /api/v1/issues/:id
router.delete('/:id', function(req, res, next){
	var issueId = req.params.id;

	Issue.remove({
		_id: issueId
	}, function(err, data){

		if(err){
			res.status(500).send(err);
			return;
		}

		console.log('Deleted' + data.n + 'documents');
		res.sendStatus(204);

	});
});


//Ajouter une action à un problème /api/v1/issues/:id/action
router.post('/:id/action', function(req, res, next) {
	var issueId = req.params.id;
	
	var action = req.body;
	console.log(action);
	
	Issue.findById(issueId, function(err, issue) {
		if(err){
			res.status(500).send(err);
			return;
		} else if (!issue) {
			res.status(404).send(err);
			return;
		}
		User.findById(issueId, function(err, user) {
			if(err){
				res.status(500).send(err);
				return;
			} else if (!user) {
				res.status(404).send(err);
				return;
			}
			issue.action.push(action);
			issue.save(function(err) {
				if(err){
					res.status(500).send(err);
					return;
				}

				res.send(action);
			})
		}
		/*
		issue.action.push(action);
		issue.save(function(err) {
			if(err){
				res.status(500).send(err);
				return;
			}

			res.send(action);
		});*/
	});
});