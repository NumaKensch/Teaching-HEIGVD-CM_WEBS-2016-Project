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

/**
 * @api {post} /issues Add an issue
 * @apiName addIssue
 * @apiGroup Issues
 *
 * @apiSuccess {String} author Users unique ID.
 * @apiSuccess {String} description Description of the Issue.
 * @apiSuccess {Date} date Date of the Issue.
 * @apiSuccess {String} status status of the Issue.
 * @apiSuccess {Number} version version of the Issue.
 * @apiSuccess {String} place  Place of the issue.
 * @apiSuccess {String} picture  Name of the picture of the issue.
 *
 * @apiSuccess [Object[]] keyWords       KeyWords of the Issue.
 * @apiSuccess {String}   keyWords.word  the word.
 * @apiSuccess {Number}   keyWords.id    Id of the word.
 *
 * @apiSuccess {Object[]} action             action of the Issue.
 * @apiSuccess {Number}   action.staffId     Id of the action's staff.
 * @apiSuccess {Date}     action.date        Date of the action.
 * @apiSuccess {Number}   action.id          Id of the action.
 * 
 * @apiSuccess {Object[]} issueType              IssueType of the issue. IssueType must exist in IssueType collection.
 * @apiSuccess {Number}   issueType.issueTypeId  Id of the issueType.
 * @apiSuccess {String}   issueType.type         Type of the issue.
 *
 * @apiSuccess {Object[]} coordinate               Coordinate of the Issue.
 * @apiSuccess {String}   coordinate.type          Type of the coordinate.
 * @apiSuccess {Number[]} coordinate.coordinates   Coordinates with longitude and latitude.
 * 
 */

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

/**
 * @api {get} /issues Request Issues informations
 * @apiName getIssues
 * @apiGroup Issues
 *
 * @apiSuccess {Number} _id Issue unique ID.
 * @apiSuccess {String} author Users unique ID.
 * @apiSuccess {String} description Description of the Issue.
 * @apiSuccess {Date} date Date of the Issue.
 * @apiSuccess {String} status status of the Issue.
 * @apiSuccess {Number} version version of the Issue.
 * @apiSuccess {String} place  Place of the issue.
 * @apiSuccess {String} picture  Name of the picture of the issue.
 *
 * @apiSuccess [Object[]] keyWords       KeyWords of the Issue.
 * @apiSuccess {String}   keyWords.word  the word.
 * @apiSuccess {Number}   keyWords.id    Id of the word.
 *
 * @apiSuccess {Object[]} action             action of the Issue.
 * @apiSuccess {Number}   action.staffId     Id of the action's staff.
 * @apiSuccess {Date}     action.date        Date of the action.
 * @apiSuccess {Number}   action.id          Id of the action.
 * 
 * @apiSuccess {Object[]} issueType              IssueType of the issue. IssueType must exist in IssueType collection.
 * @apiSuccess {Number}   issueType.issueTypeId  Id of the issueType.
 * @apiSuccess {String}   issueType.type         Type of the issue.
 *
 * @apiSuccess {Object[]} coordinate               Coordinate of the Issue.
 * @apiSuccess {String}   coordinate.type          Type of the coordinate.
 * @apiSuccess {Number[]} coordinate.coordinates   Coordinates with longitude and latitude.
 * 
 * @apiSuccessExample Success-Response:
 *     	HTTP/1.1 200 OK
 *		{
 * 			"author": "56cec89e5ede0e8d072e2eed",
 * 			"description": "lampadaire cassé",
 * 			"status": "created",
 * 			"date": "2015-12-01T00:00:00.000Z",
 * 			"__v": 0,
 * 			"place": "hello",
 * 			"picture": "kdnsdnfknsd",
 * 			"_id": "56dd7121e39cd5301289ec8d",
 * 			"keyWords": [],
 * 			"action": [],
 * 			"issueType": {
 *  		 	"issueTypeId": "56dc79d3cbbfd36e1158d14f",
 *   			"type": "lampadaire cassé"
 *			},
 * 			"coordinate": {
 *  			"type": "salut",
 *   			"coordinates": []
 * 			}
 *		}
 * 
 */

router.get('/', function(req, res, next){
	var criteria = {};

	var latitude = req.query.lat,
      	longitude = req.query.lon,
      	distance = req.query.dist;
/**
 * @api {get} /issues?issueType={string} List of issues of an issue's type defined.
 * @apiName GetIssuesBetweenDate
 * @apiGroup Issues
 *
 */
	if (req.query.issuesType) {
		criteria["issueType.type"] = req.query.issuesType;
	}

/**
 * @api {get} /issues?lat={number}&lon={number}&dist={number} List of issues around of a location. dist define the size of the circle around the coordinate.
 * @apiName GetIssuesBetweenDate
 * @apiGroup Issues
 *
 */	
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

/**
 * @api {get} /issues?startDate={integer}&endDate={integer} Request Issues between two dates.
 * @apiName GetIssuesBetweenDate
 * @apiGroup Issues
 *
 */
	if (req.query.startDate && req.query.endDate) {
		criteria.date = { $gte: req.query.startDate, $lte: req.query.endDate};
	}

/**
 * @api {get} /issues?status={string} List of issues of a status defined.
 * @apiName GetIssuesBetweenDate
 * @apiGroup Issues
 *
 */
	if (req.query.status) {
		criteria.status = req.query.status;
	}

/**
 * @api {get} /issues?page={integer}&pageSize={integer} Request Issues information per page and check size.
 * @apiName GetIssuesPerPageAndSize
 * @apiGroup Issues
 *
 */	
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
/**
 * @api {get} /issues/:id Request an Issue informations
 * @apiName getIssues
 * @apiGroup Issues
 *
 * @apiParam {Number} id Issues unique ID.
 * 
 * @apiSuccess {Number} _id Issue unique ID.
 * @apiSuccess {String} author Users unique ID.
 * @apiSuccess {String} description Description of the Issue.
 * @apiSuccess {Date} date Date of the Issue.
 * @apiSuccess {String} status status of the Issue.
 * @apiSuccess {Number} version version of the Issue.
 * @apiSuccess {String} place  Place of the issue.
 * @apiSuccess {String} picture  Name of the picture of the issue.
 *
 * @apiSuccess [Object[]] keyWords       KeyWords of the Issue.
 * @apiSuccess {String}   keyWords.word  the word.
 * @apiSuccess {Number}   keyWords.id    Id of the word.
 *
 * @apiSuccess {Object[]} action             action of the Issue.
 * @apiSuccess {Number}   action.staffId     Id of the action's staff.
 * @apiSuccess {Date}     action.date        Date of the action.
 * @apiSuccess {Number}   action.id          Id of the action.
 * 
 * @apiSuccess {Object[]} issueType              IssueType of the issue. IssueType must exist in IssueType collection.
 * @apiSuccess {Number}   issueType.issueTypeId  Id of the issueType.
 * @apiSuccess {String}   issueType.type         Type of the issue.
 *
 * @apiSuccess {Object[]} coordinate               Coordinate of the Issue.
 * @apiSuccess {String}   coordinate.type          Type of the coordinate.
 * @apiSuccess {Number[]} coordinate.coordinates   Coordinates with longitude and latitude.
 * 
 * @apiSuccessExample Success-Response:
 *     	HTTP/1.1 200 OK
 *		{
 * 			"author": "56cec89e5ede0e8d072e2eed",
 * 			"description": "lampadaire cassé",
 * 			"status": "created",
 * 			"date": "2015-12-01T00:00:00.000Z",
 * 			"__v": 0,
 * 			"place": "hello",
 * 			"picture": "kdnsdnfknsd",
 * 			"_id": "56dd7121e39cd5301289ec8d",
 * 			"keyWords": [],
 * 			"action": [],
 * 			"issueType": {
 *  		 	"issueTypeId": "56dc79d3cbbfd36e1158d14f",
 *   			"type": "lampadaire cassé"
 *			},
 * 			"coordinate": {
 *  			"type": "salut",
 *   			"coordinates": []
 * 			}
 *		}
 * 
 * @apiError IssueNotFound The id of the issue was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Issue not found"
 *     }
 *
 */
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
/**
 * @api {delete} /issues/:id
 * @apiName deleteIssue
 * @apiGroup Issues
 *
 * @apiParam {Number} id Issue unique ID.
 *
 *
 * @apiError IssueNotFound The id of the issue was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Issue not found"
 *     }
 *
 */
router.delete('/:id', findIssue,function(req, res, next){
	var issueId = req.params.id;

	Issue.remove({
		_id: issueId
	}, function(err, data){

		if(err){
			res.status(500).send(err);
			return;
		}
		Comment.remove({
			issue: issueId
		}, function(err, data){

			if(err){
				res.status(500).send(err);
				return;
			}
			res.sendStatus(204);
		});
	});
});


//Ajouter une action à un problème /api/v1/issues/:id/action
//*************************
// !!! NE CONTROLE PAS LE ROLE !!!
//*************************
/**
 * @api {post} /issues/:id/action Add an action to an issue and change the actual status of the issue.
 * @apiName addIssueAction
 * @apiGroup Issues
 *
 * @apiParam {Number} id Issues unique ID.
 *
 * @apiSuccess {Object[]} action             action of the Issue.
 * @apiSuccess {Number}   action.staffId     Id of the action's staff.
 * @apiSuccess {Date}     action.date        Date of the action.
 * @apiSuccess {Number}   action.id          Id of the action.
 *
 * @apiError IssueNotFound The id of the issue was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Issue not found"
 *     }
 * 
 */
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
/**
 * @api {post} /issues/:id/comment Add a comment to an issue
 * @apiName addComment
 * @apiGroup Issues
 * 
 * @apiParam {Number} id Issues unique ID.
 * 
 * @apiSuccess {Number} issue  Identifiant of the issue.
 * @apiSuccess {Number} author  Identifiant of the user who writes the comment.
 * @apiSuccess {String} content  The comment of the issue.
 * @apiSuccess {Date} date  The date of the comment.
 *
 *
 * @apiError IssueNotFound The id of the issue was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Issue not found"
 *     }
 *
 *
 * @apiError UserNotFound The id of the User was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "UserNotFound"
 *     }
 *
 */
router.post('/:id/comment', findIssue, findUserGenerator("author"),function(req, res, next) {	
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
/**
 * @api {get} /issues/:id/comment The comments of an Issue
 * @apiName getIssueComment
 * @apiGroup Issues
 * 
 * @apiParam {Number} id Issues unique ID.
 * 
 * @apiSuccess {Number} issue  Identifiant of the issue.
 * @apiSuccess {Number} author  Identifiant of the user who writes the comment.
 * @apiSuccess {String} content  The comment of the issue.
 * @apiSuccess {Date} date  The date of the comment.
 *
 * @apiSuccessExample Success-Response:
 *     	HTTP/1.1 200 OK
 *		[
 *			{
 *   			"_id": "56dd79651f11d66c12d8cab4",
 *   			"issue": "56d03e3204f915e60aafa853",
 *   			"author": "56cec89e5ede0e8d072e2eed",
 *   			"content": "The repairer is coming",
 *   			"date": "2015-12-01T00:00:00.000Z",
 *   			"__v": 0
 * 			}
 * 		]
 *
 *
 * @apiError IssueNotFound The id of the issue was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Issue not found"
 *     }
 *
 *
 * @apiError UserNotFound The id of the User was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "UserNotFound"
 *     }
 *
 */
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
/**
 * @api {delete} /issues/:id/Comment/:idComment
 * @apiName deleteComment
 * @apiGroup Issues
 *
 * @apiParam {Number} id Issue unique ID.
 *
 *
 * @apiError IssueNotFound The id of the issue was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Issue not found"
 *     }
 *
 *
 * @apiError CommentNotFound The id of the comment was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Comment not found"
 *     }
 *
 *
 */
router.delete('/:id/Comment/:idComment', findIssue, function(req, res, next){
	var idComment = req.params.idComment;
	Comment.findById(idComment, function(err, comment){
		if(err){
			res.status(500).send(err);
			return;
		} else if (!comment) {
			res.status(404).send("Comment not found");
			return;
		}
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
});

//GET l'historique des actions d'un problème
/**
 * @api {get} /issues/:id/action The actions history of an Issue
 * @apiName getIssueAction
 * @apiGroup Issues
 * 
 * @apiParam {Number} id Issues unique ID.
 *
 * @apiSuccess {Object[]} action             action of the Issue.
 * @apiSuccess {Number}   action.staffId     Id of the action's staff.
 * @apiSuccess {Date}     action.date        Date of the action.
 * @apiSuccess {Number}   action.id          Id of the action.
 *
 * @apiSuccessExample Success-Response:
 *     	HTTP/1.1 200 OK
 *		[
 * 			{
 *   			"staffId": "56cec89e5ede0e8d072e2eed",
 *   			"date": "2014-05-13T00:00:00.000Z",
 *   			"description": "jsdkdksnfksdkf",
 *   			"_id": "56dae2bfe8b58afa0d463e57"
 * 			},
 * 			{
 *   			"staffId": "56cec89e5ede0e8d072e2eed",
 *   			"date": "2014-05-13T00:00:00.000Z",
 *  			"description": "jsdkdksnfksdkf",
 *   			"_id": "56dae2ebe8b58afa0d463e58"
 * 			}
 *		]
 *
 *
 * @apiError IssueNotFound The id of the issue was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Issue not found"
 *     }
 *
 */
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
