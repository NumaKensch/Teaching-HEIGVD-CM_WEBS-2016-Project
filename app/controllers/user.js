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
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 * 
 * @apiSuccess {String[]} role  role of the User (star or citizen or both).
 *
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



/**
 * @api {get} /users/:id Request User information
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {Number} id Users unique ID.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 *
 * @apiSuccess {String[]} role  role of the User (star or citizen or both).
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      "name": {
 *        "first": "Jean",
 *        "last": "Dupont"
 *     },
 *      "role":["citizen", "staff"]
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


/**
 * @api {delete} /users/:id Delete User information
 * @apiName deleteUser
 * @apiGroup User
 *
 * @apiParam {Number} id Users unique ID.
 *
 * @apiError UserNotFound The id of the User was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "UserNotFound"
 *     }
 */
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


/**
 * @api {post} /users/:idUser/role Add the role staff to a user
 * @apiName addRoleStaff
 * @apiGroup User
 * 
 * @apiSuccess {String[]} role  role of the User (star or citizen or both).
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

/**
 * @api {delete} /users/:idUser/role Delete the role staff to a user
 * @apiName deleteRoleStaff
 * @apiGroup User
 *
 * @apiParam {Number} id Users unique ID.
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



/**
 * @api {get} /:idUser/issue Get the list of the issues raised by a user
 * @apiName GetIssuesRaisedByUser
 * @apiGroup User
 *
 * @apiParam {Number} id Users unique ID.
 *
 * @apiSuccess {Number} id Issue unique ID.
 * @apiSuccess {String} author Users unique ID.
 * @apiSuccess {String} description Description of the Issue.
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
 * @apiSuccess {Object[]} issueType              IssueType of the issue.
 * @apiSuccess {Number}   issueType.issueTypeId  Id of the issueType.
 * @apiSuccess {String}   issueType.type         Type of the issue.
 *
 * @apiSuccess {Object[]} coordinate               Coordinate of the Issue.
 * @apiSuccess {String}   coordinate.type          Type of the coordinate.
 * @apiSuccess {Number[]} coordinate.coordinates   Coordinates with longitude and latitude.
 *
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *   "_id": "56d024b7f3b5d46815091085",
 *   "author": "56cf02994217783c3712280c",
 *   "description": "boum",
 *   "status": "boum",
 *  "__v": 0,
 *   "keyWords": [
 *     {
 *       "word": "boum",
 *       "_id": "56d024b7f3b5d46815091086"
 *     }
 *   ],
 *   "action": [
 *     {
 *       "staffId": "56cf02994217783c3712280c",
 *       "date": "2015-12-02T00:00:00.000Z",
 *       "description": "boum",
 *       "_id": "56d024b7f3b5d46815091087"
 *     }
 *   ],
 *   "issueType": {
 *     "issueTypeId": "56d01204fc5887801256e80e",
 *     "type": "boum"
 *   },
 *  "coordinate": {
 *     "type": "boum",
 *     "coordinates": [
 *       1236
 *     ]
 *   }
 * }
 *
 * @apiError UserNotFound The id of the User was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "UserNotFound"
 *     }
 */

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




/**
 * @api {get} /users Request User information
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {Number} id Users unique ID.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 *
 * @apiSuccess {String[]} role  role of the User (star or citizen or both).
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      "name": {
 *        "first": "Jean",
 *        "last": "Dupont"
 *     },
 *      "role":["citizen", "staff"]
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
router.get('/', function(req, res, next){
	var criteria = {};

/**
 * @api {get} /users?status={string}&order={string} Get users who had issues with this status and the number of he did. By default the order is descendant. Use the parameter order to do an ascendant order. Order parameter only works with status parameter 
 * @apiName GetUsersByRole
 * @apiGroup User
 *
 */	
	if (req.query.status) {
		criteria.status = req.query.status;
	}
	if (req.query.order) {
		criteria.order = req.query.order;
	}

/**
 * @api {get} /users?role={string} Listing users with the role declaring.
 * @apiName GetUsersByRole
 * @apiGroup User
 *
 */
	if (req.query.role) {
		criteria.role ={$in:[req.query.role]};
	}




/**
 * @api {get} /users?page={integer}&pageSize={integer} Request User information per page and check size.
 * @apiName GetUserPerPageAndSize
 * @apiGroup User
 *
 */
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



  	function countFilteredUsers(callback) {
	  	if (criteria !== ""){
	  		Issue.find( { status: criteria.status },function(err, issues){

				if(err){
					res.status(500).send(err);
					return;
				}

				var users = [];
				var filteredCount = 0;
				var userExist = false;
		  		if (criteria.status == "created") {
		  			for (var i = 0; i < issues.length; i++ ) {
		  				for (var j = 0; j < users.length; j++ ) {
		  					if (issues[i].author == String(users[j])) {
		  						userExist = true;
		  					}
		  				}
		  				if (userExist === false) {
		  					users.push(issues[i].author);
		  					filteredCount += 1;
		  				} else {
		  					userExist = false;
	  					}
		  			}
		  		} else {
					for (var x = 0; x < issues.length; x++ ) {
		  				for (var y = 0; y < users.length; y++ ) {
		  					if (issues[x].action[1].staffId == String(users[y])) {
		  						userExist = true;
		  					}
		  				}
		  				if (userExist === false) {
		  					users.push(issues[x].action[1].staffId);
		  					filteredCount += 1;
		  				} else {
		  					userExist = false;
	  					}
		  			}		  			
		  		}
		  		console.log(parseInt(filteredCount));
		  		filteredCount = parseInt(filteredCount);
		  		callback(undefined, filteredCount);
			});	
	  	} else {  
	  		User.count(function(err, filteredCount) {
	  			if (err) {
	  				callback(err);
	  			} else {
	  				callback(undefined, filteredCount);
	  			}
	  		});
	  	}
  	}


  	function findMatchingUsers(callback) {
  		if (req.query.status) {
			Issue.find( { status: criteria.status })
				.populate("author action.staffId")
				.exec(function(err, issues){
					if(err){
						res.status(500).send(err);
						return;
					}
					var users = [];
					var userExist = false;
			  		if (criteria.status == "created") {
			  			for (var i = 0; i < issues.length; i++ ) {
			  				for (var j = 0; j < users.length; j++ ) {
			  					if (issues[i].author == String(users[j].id)) {
			  						userExist = true;
			  						users[j].numberIssues = users[j].numberIssues + 1;
			  					}
			  				}
			  				if (userExist === false) {
			  					users.push({ id : issues[i].author, numberIssues : 1});
			  				} else {
			  					userExist = false;
							}
			  			}
			  		} else {
						for (var x = 0; x < issues.length; x++ ) {
			  				for (var y = 0; y < users.length; y++ ) {
			  					if (issues[x].action[1].staffId == String(users[y])) {
			  						userExist = true;
			  						users[y].numberIssues = users[y].numberIssues + 1;
			  					}
			  				}
			  				if (userExist === false) {
			  					users.push({ id : issues[x].action[1].staffId , numberIssues : 1});
			  				} else {
			  					userExist = false;
								}
			  			}		  			
			  		}

			  		if (criteria.order == "desc") {
		  				users.sort(function (a, b) {
			  				if (a.numberIssues > b.numberIssues) return 1;
			  				if (a.numberIssues < b.numberIssues) return -1;
			  				return 0;
			  			});
		  			} else {
			  			users.sort(function (a, b) {
			  				if (a.numberIssues < b.numberIssues) return 1;
			  				if (a.numberIssues > b.numberIssues) return -1;
			  				return 0;
			  			});
			  		}
			  		callback(undefined, users);
			});	
		} else {
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