var express = require('express'),
router = express.Router(),
mongoose = require('mongoose'),
IssueType =mongoose.model('IssueType');

module.exports = function (app) {
	app.use('/api/v1/issuesTypes', router);
};

function findIssueType(req, res, next){
	console.log(req.params.idIssueType);
	IssueType.findById(req.params.idIssueType, function(err, issueType){
		if(err){
			res.status(500).send(err);
			return;
		} else if (!issueType){
			res.status(404).send('IssueType not found');
			return;
		}
		req.issueType = issueType;
		next();
	});
}

/**
 * @api {post} /issuesTypes Add a type of issue
 * @apiName addIssueType
 * @apiGroup IssueType
 *
 * @apiSuccess {String} nameShort  nameShort of the IssueType.
 * @apiSuccess {String} description  Description of the IssueType.
 * 
 *
 */
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


/**
 * @api {get} /issuesTypes Request issuesTypes information
 * @apiName GetIssuesTypes
 * @apiGroup IssuesTypes
 *
 * @apiSuccess {Number} id Id of the IssueType.
 * @apiSuccess {String} nameShort  nameShort of the IssueType.
 * @apiSuccess {String} description  Description of the IssueType.
 * @apiSuccess {Number} version Version of the IssueType.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        "_id": "56d01204fc5887801256e80e",
 *        "nameShort": "cassé",
 *        "description": "poteau",
 *        "__v": 0
 *     }
 *
 * @apiError IssueTypeNotFound The id of the IssueType was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "IssueTypeNotFound"
 *     }
 */
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

/**
 * @api {delete} //:idIssueType Delete a issueType information
 * @apiName deleteIssueType
 * @apiGroup IssueType
 *
 * @apiParam {Number} id IssueType unique ID.
 *
 * @apiError IssueTypeNotFound The id of the IssueType was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "IssueTypeNotFound"
 *     }
 */
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


/**
 * @api {get} /issuesTypes/:idIssu Request a issueType information
 * @apiName GetIssueType
 * @apiGroup IssuesTypes
 *
 * @apiSuccess {Number} id Id of the IssueType.
 * @apiSuccess {String} nameShort  nameShort of the IssueType.
 * @apiSuccess {String} description  Description of the IssueType.
 * @apiSuccess {Number} version Version of the IssueType.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        "_id": "56d01204fc5887801256e80e",
 *        "nameShort": "cassé",
 *        "description": "poteau",
 *        "__v": 0
 *     }
 *
 * @apiError IssueTypeNotFound The id of the IssueType was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "IssueTypeNotFound"
 *     }
 */

router.get('/:idIssueType', findIssueType, function(req, res, next){
	var idIssueType = req.params.idIssueType;
	var criteria = {"_id":idIssueType};

	IssueType.find(criteria, function(err, issueType){
		if(err){
			res.status(500).send(err);
			return;
		} 
		res.send(issueType);
	});
});
