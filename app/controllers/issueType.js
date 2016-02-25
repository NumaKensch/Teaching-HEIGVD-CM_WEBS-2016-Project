var express = require('express'),
router = express.Router(),
mongoose = require('mongoose'),
User =mongoose.model('issuesTypes');

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

//Get /api/v1/users
//get the list of all users
router.get('/', function(req, res, next){
	IssueType.find(function (err,user){
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
	 = req.params.id;

	IssueType.findById(idUser
		, function(err, user){
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
	 = req.params.id;

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
	router.get('/api/v1/users?page=:integer&per_page=:integer', function(req, res, next){
		User.find(function (err,user){
			if (err){
				res.status(500).send(err);
				return;
			}
		res.send(user);
		});
	});


//POST /api/v1/users 
//Add the role staff to a citizen

router.post('/api/v1/users?:idUser?role=:idRole', function (req, res, next){
	var user = new User(req.body);

	user.save(function(err, addRole){
		if (err) {
			res.status(500).send(err);
			return;
		}

		res.send(addRole);
	});
});

//DELETE /api/v1/users/:idUser
//Delete the role staff to a citizen
router.delete('/api/v1/users?:idUser?role=:idRole', function(req, res, next){

	var idRole
	 = req.params.idRole;

	User.role.remove({
		_id: idRole

	}, function(err, data){

		if(err){
			res.status(500).send(err);
			return;
		}

		console.log('Deleted' + data.n + 'documents');
		res.sendStatus(204);

	});
});