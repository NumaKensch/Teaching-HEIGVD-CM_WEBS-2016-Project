var express = require('express'),
async = require('async'),
router = express.Router(),
mongoose = require('mongoose'),
User =mongoose.model('User');
Issue =mongoose.model('Issue');

module.exports = function (app) {
	app.use('/api/v1/users', router);
};

function findUser(req, res, next){
	console.log(req.params.idUser);
	User.findById(req.params.idUser, function(err, user){
		if(err){
			res.status(500).send(err);
			return;
		} else if (!user){
			res.status(404).send('User not found');
			return;
		}
		req.user = user;
		next();
	});
}


/**
 * @api {post} /users Add a user
 * @apiName addUser
 * @apiGroup Users
 *
 * @apiParam {Number} id Users unique ID.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "firstname": "John",
 *       "lastname": "Doe"
 *     }
 *
 * @apiError UserNotFound The id of the User was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "UserNotFound"
 *     }
 */
router.post('/', function (req, res, next){
	var user = new User(req.body);

	user.save(function(err, createdUser){
		if (err) {
			res.status(500).send(err);
			return;
		}

		res.send(createdUser);
	});
});



//Get /api/v1/users
//get the list of all users

/**
 * @api {get} /user/:id Request User information
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {Number} id Users unique ID.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "firstname": "John",
 *       "lastname": "Doe"
 *     }
 *
 * @apiError UserNotFound The id of the User was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "UserNotFound"
 *     }
 */

//Get /api/v1/users selon ID
//get a user
router.get('/:idUser', function(req, res, next){
	var idUser
	 = req.params.idUser;

	User.findById(idUser, function(err, user){
		if(err){
			res.status(500).send(err);
			return;
		} else if (!user){
			res.status(404).send('User not found');
			return;
		}
		res.send(user);
	});
});


//DELETE /api/v1/users/:id
//Delete a user
router.delete('/:idUser', function(req, res, next){

	var idUser
	 = req.params.idUser;

	User.remove({
		_id: idUser

	}, function(err, data){

		if(err){
			res.status(500).send(err);
			return;
		}

		console.log('Deleted' + data.n + 'documents');
		res.sendStatus(204);

	});
});

//GET /api/v1/users/:id
//get the list of all users with the pagination
	router.get('/api/v1/users?page={integer}&per_page={integer}', function(req, res, next){
		User.find(function (err,user){
			if (err){
				res.status(500).send(err);
				return;
			}
		res.send(user);
		});
	});


//POST /api/v1/users/:id/role 
//Add the role staff to a user

router.post('/:idUser/role', function (req, res, next){
	
	var userId = req.params.idUser;

	var role = req.body.role;

	User.findById(userId,function(err, user){
		if (err) {
			res.status(500).send(err);
			return;
		} else if (!user) {
			res.status(404).send(err);
			return;
		}
			//user.role.push(role);
			for(var i=0;i<role.length;i++){
				if(user.role.indexOf(role[i])==-1){
					user.role.push(role[i]);
				}
			}
			user.save(function(err) {
				if(err){
					res.status(500).send(err);
					return;
				}

				res.send(user);
			});
	});
});


//DELETE /api/v1/users/:idUser/role
//Delete the role staff to a use

router.delete('/:idUser/role/:role',findUser,function(req, res, next){
	var userId = req.params.idUser;

	var role = req.params.role;

	User.findById(userId,function(err, user){
		if (err) {
			res.status(500).send(err);
			return;
		} else if (!user) {
			res.status(404).send(err);
			return;
		}

		
			var index = user.role.indexOf(role);
				if(user.role.indexOf(role)!=-1){
					user.role.splice(index,1);
				
			}

			user.save(function(err) {
				if(err){
					res.status(500).send(err);
					return;
				}

				res.sendStatus(204);
			});
	});
});



//Get /api/v1/users selon ID
//get the list of the issues raised by a user

router.get('/:idUser/issues', findUser, function(req, res, next){
	var idUser = req.params.idUser;
	var criteria = {"author":idUser};

	Issue.find(criteria, function(err, issues){
		if(err){
			res.status(500).send(err);
			return;
		} 
		res.send(issues);
	});
});




//Get /api/issues
router.get('/', function(req, res, next){
	var criteria = {};

	console.log("bou");

	if (req.query.limit) {
		var limitUser = req.query.limit;
	}

	if (req.query.status) {
		criteria.status = req.query.status;
	}

	if (req.query.role) {
		criteria.role ={$in:[req.query.role]};
	}

	// Get page and page size for pagination.
	var page = req.query.page ? parseInt(req.query.page, 10) : 1,
	pageSize = req.query.pageSize ? parseInt(req.query.pageSize, 10) : 30;

	// Convert page and page size to offset and limit.
	var offset = (page - 1) * pageSize,
	limit = pageSize;

	// Count all users (without filters).
	function countAllUsers(callback) {
		User.count(function(err, totalCount) {
	  		if (err) {
	    		callback(err);
	  		} else {
	    		callback(undefined, totalCount);
	  		}
		});
	}



  	// Count books matching the filters.
  	function countFilteredUsers(callback) {
    	User.count(criteria, function(err, filteredCount) {
      	if (err) {
        		callback(err);
      		} else {
        		callback(undefined, filteredCount);
      		}
    	});
  	}

  	// Find books matching the filters.
  	function findMatchingUsers(callback) {

    	var query = User
      	.find(criteria)

      	// Do not forget to sort, as pagination makes more sense with sorting.
      	.sort('name.first')
      	.skip(offset)
      	.limit(limit);

    	// Embed publisher object if specified in the query.
    	if (req.query.embed == 'publisher') {
      		query = query.populate('publisher');
    	}

    	// Execute the query.
    	query.exec(function(err, users) {
      		if (err) {
        		callback(err);
      		} else {
        		callback(undefined, users);
      		}
    	});
  	}

  	function findUsersByIssuesStatus(callback){
  		var issues;

  		Issue.find(function(err, issuesTmp) {
	  		if (err) {
	    		callback(err);
	  		} else {
	    		issues=issuesTmp;
	  		}
		});

    	// Embed publisher object if specified in the query.
    	if (req.query.embed == 'publisher') {
      		query = query.populate('publisher');
    	}

    	// Execute the query.
    	query.exec(function(err, users) {
      		if (err) {
        		callback(err);
      		} else {
        		callback(undefined, users);
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
        users = results[2];

    	// Return the pagination data in headers.
    	res.set('X-Pagination-Page', page);
    	res.set('X-Pagination-Page-Size', pageSize);
    	res.set('X-Pagination-Total', totalCount);
    	res.set('X-Pagination-Filtered-Total', filteredCount);

    	res.send(users);
  	}

	async.parallel([
    countAllUsers,
    countFilteredUsers,
    findMatchingUsers
  	], sendResponse);
});