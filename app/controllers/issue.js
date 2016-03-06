var async = require('async'),
express = require('express'),
router = express.Router(),
mongoose = require('mongoose'),
Issue =mongoose.model('Issue');
User =mongoose.model('User');
Comment =mongoose.model('Comment');
IssueType =mongoose.model('IssueType');

module.exports = function (app) {
	app.use('/api/v1/issues', router);
};

function findIssue(req, res, next){
	Issue.findById(req.params.id, function(err, issue){
		if(err){
			res.status(500).send(err);
			return;
		} else if (!issue){
			res.status(404).send('Issue not found');
			return;
		}
		req.issue = issue;
		next();
	});
}
//Fonction permettant d'adapter le middleware par rapport 
//à l'attribut passé en paramètre pour controller l'utilisateur
function findUserGenerator(attribute) {
	return function (req, res, next) {
		User.findById(req.body[attribute], function(err, user) {
			if(err){
				res.status(500).send(err);
				return;
			} else if (!user) {
				res.status(404).send('User not found');
				return;
			}
			req.user = user;
			next();
		});
	};
}

//Post /api/issues
router.post('/', function (req, res, next){
	var issue = new Issue(req.body);
	issue.status = "created";

	IssueType.findById(issue.issueType.issueTypeId, function(err, issueType){
		if(err){
			res.status(500).send(err);
			return;
		}else if (!issueType) {
			res.status(404).send('IssueType not found');
			return;
		}else if (issueType.nameShort != issue.issueType.type) {
			res.status(404).send("Issue type doesn't match with IssueType related");
			return;
		}else {
			issue.save(function(err, createdIssue){
				if (err) {
					res.status(500).send(err);
					return;
				}
				res.send(createdIssue);
			});
		}
	});
});

//Get /api/issues
router.get('/', function(req, res, next){
	var criteria = {};

	var latitude = req.query.latitude,
      	longitude = req.query.longitude,
      	distance = req.query.distance;

	if (req.query.issuesType) {
		criteria["issueType.type"] = req.query.issuesType;
	}
	
	if (latitude && longitude && distance) {
		criteria.location = {
	  		$near: {
	    		$geometry: {
	      		type: 'Point',
	      		coordinates: [
	        		parseFloat(longitude),
	        		parseFloat(latitude)
	      		]
	    },
	    $maxDistance: parseInt(distance, 10)
	  }
	};
	}

	if (req.query.startDate) {
		criteria.date = { $gte: req.query.startDate, $lte: req.query.endDate};
	}

	if (req.query.status) {
		criteria.status = req.query.status;
	}

	// Get page and page size for pagination.
	var page = req.query.page ? parseInt(req.query.page, 10) : 1,
	pageSize = req.query.pageSize ? parseInt(req.query.pageSize, 10) : 30;

	// Convert page and page size to offset and limit.
	var offset = (page - 1) * pageSize,
	limit = pageSize;

	// Count all books (without filters).
	function countAllIssues(callback) {
		Issue.count(function(err, totalCount) {
	  		if (err) {
	    		callback(err);
	  		} else {
	    		callback(undefined, totalCount);
	  		}
		});
	}

  	// Count books matching the filters.
  	function countFilteredIssues(callback) {
    	Issue.count(criteria, function(err, filteredCount) {
      	if (err) {
        		callback(err);
      		} else {
        		callback(undefined, filteredCount);
      		}
    	});
  	}

  	// Find books matching the filters.
  	function findMatchingIssues(callback) {

    	var query = Issue
      	.find(criteria)
      	.sort('date')
      	.skip(offset)
      	.limit(limit);

    	// Embed publisher object if specified in the query.
    	if (req.query.embed == 'publisher') {
      		query = query.populate('publisher');
    	}

    	// Execute the query.
    	query.exec(function(err, issues) {
      		if (err) {
        		callback(err);
      		} else {
        		callback(undefined, issues);
      		}
    	});
  	}

  	// Set the pagination headers and send the matching books in the body.
  	function sendResponse(err, results) {
    	if (err) {
      		res.status(500).send(err);
      		return;
    	}

    	var totalCount = results[0],
        filteredCount = results[1],
        issues = results[2];

    	// Return the pagination data in headers.
    	res.set('X-Pagination-Page', page);
    	res.set('X-Pagination-Page-Size', pageSize);
    	res.set('X-Pagination-Total', totalCount);
    	res.set('X-Pagination-Filtered-Total', filteredCount);

    	res.send(issues);
  	}

	async.parallel([
    countAllIssues,
    countFilteredIssues,
    findMatchingIssues
  	], sendResponse);
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
//*************************
// !!! NE DELETE PAS LES COMMENTAIRES !!!
//*************************
router.delete('/:id', findIssue,function(req, res, next){
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
//*************************
// !!! NE CONTROLE PAS LE ROLE !!!
//*************************
router.post('/:id/action', findIssue, findUserGenerator("staffId"), function(req, res, next) {
		var action = req.body;
		
		if (req.issue.status == "solved" || req.issue.status == "rejected") return res.send("No actions possible");
		if (req.issue.status != "created" && req.issue.action.author != action.author) return res.send("Issue allready assigned");

		req.issue.action.push(action);
		req.issue.save(function(err) {
			if(err){
				res.status(500).send(err);
				return;
			}
			switch(req.issue.status) {
			    case "created":
			        Issue.findByIdAndUpdate (req.issue._id, {$set: {status: "acknowledged"}}, function (err, issue) {
			        	if (err) return res.status(500).send(err);
  						res.send(issue);
			        });
			        break;
			    case "acknowledged":
			        Issue.findByIdAndUpdate (req.issue._id, {$set: {status: "assigned"}}, function (err, issue) {
			        	if (err) return res.status(500).send(err);
  						res.send(issue);
			        });
			        break;
			    case "assigned":
			        Issue.findByIdAndUpdate (req.issue._id, {$set: {status: "in_progress"}}, function (err, issue) {
			        	if (err) return res.status(500).send(err);
  						res.send(issue);
			        });
			        break;
			    case "in_progress":
			        Issue.findByIdAndUpdate (req.issue._id, {$set: {status: "solved"}}, function (err, issue) {
			        	if (err) return res.status(500).send(err);
  						res.send(issue);
			        });
			        break;
			    default:
			    	res.status(404).send("Issue status not found");
			}

		});
});

//Ajouter un commentaire à un problème /api/v1/issues/:id/comment
router.post('/:id/comment', findIssue, findUserGenerator("author"),function(req, res, next) {
	var issueId = req.params.id;
	
	var comment = new Comment(req.body);
	comment.save(function(err, createdComment){
		if (err) {
			res.status(500).send(err);
			return;
		}

		res.send(createdComment);
	});
});

//Afficher les commentaires d'un problème /api/v1/issues/:id/comment
router.get('/:id/comment', findIssue, function(req, res, next) {	
	var issueId = req.params.id;
	var criteria = {"issue": issueId};

	Comment.find(criteria, function(err, comment){
		if(err){
			res.status(500).send(err);
			return;
		}
		res.send(comment);
	});
});

//DELETE un commentaire /api/v1/issues/:id/Comment/:idComment
router.delete('/:id/Comment/:idComment', findIssue, function(req, res, next){
	var idComment = req.params.idComment;
		Comment.remove({
			_id: idComment
		}, function(err, data){

			if(err){
				res.status(500).send(err);
				return;
			}
			res.sendStatus(204);

		});
});

//GET l'historique des actions d'un problème
router.get('/:id/action', findIssue,function(req, res, next){
	var idIssue = req.params.id;

	Issue
	.findById(idIssue)
	.populate('action') // only return the Persons name
	.exec(function (err, issue) {
	  	if (err) {
	  		res.status(500).send(err);
	  		return;
	  	}

	  	res.send(issue.action);
	});
});
