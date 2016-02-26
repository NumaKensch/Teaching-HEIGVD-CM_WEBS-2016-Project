var express = require('express'),
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

//POST /api/v1/users 
//Add a user and his role

/**
 * @api {post} /users Add a user
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
router.get('/', function(req, res, next){
	User.find(function (err,user){
		if (err){
			res.status(500).send(err);
			return;
		}
	res.send(user);
	});
});

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


//Get /api/v1/users
//get the list of all users "citizen"
router.get('/api/v1/', function(req, res, next){
	User.find(role, function (err,user){
		if (err){
			res.status(500).send(err);
			return;
		}
	res.send(user);
	});
});



//Get /api/v1/users selon ID
//get the list of the issues raised by a user

router.get('/:idUser/issue', findUser, function(req, res, next){
	var idUser = req.params.idUser;
	var criteria = {"author":idUser};

	Issue.find(criteria, function(err, issue){
		if(err){
			res.status(500).send(err);
			return;
		} 
		res.send(issue);
	});
});


