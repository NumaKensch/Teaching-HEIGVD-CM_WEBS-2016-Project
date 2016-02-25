var express = require('express'),
router = express.Router(),
mongoose = require('mongoose'),
User =mongoose.model('User');

module.exports = function (app) {
	app.use('/api/users', router);
};

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

//Get /api/users
router.get('/', function(req, res, next){
	User.find(function (err,user){
		if (err){
			res.status(500).send(err);
			return;
		}
	res.send(user);
	});
});

//Get /api/users selon ID
router.get('/:id', function(req, res, next){
	var userId = req.params.id;

	User.findById(userId, function(err, user){
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

//PUT /api/people/:id
router.put('/:id', function(req,res,next){

	var userId = req.params.id;

	User.findById(userId, function(err, user){
		if(err){
			res.status(500).send(err);
			return;
		}

	user.save(req.body, function(err,updatedUser){
		if(err){
			res.status(500).send(err);
			return;
		}
		res.send(updatedUser);

	});
	});

});

//DELETE /api/users/:id
router.delete('/:id', function(req, res, next){

	var userId = req.params.id;

	User.remove({
		_id: userId
	}, function(err, data){

		if(err){
			res.status(500).send(err);
			return;
		}

		console.log('Deleted' + data.n + 'documents');
		res.sendStatus(204);

	});
});