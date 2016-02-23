var express = require('express'),
router = express.Router(),
mongoose = require('mongoose'),
Person =mongoose.model('Person');

module.exports = function (app) {
	app.use('/api/people', router);
};

router.post('/', function (req, res, next){
	var person = new Person(req.body);

	person.save(function(err, createdPerson){
		if (err) {
			res.status(500).send(err);
			return;
		}

		res.send(createdPerson);
	});
});

//Get /api/people
router.get('/', function(req, res, next){
	Person.find(function (err,people){
		if (err){
			res.status(500).send(err);
			return;
		}
	res.send(people);
	});
});

a=3;
//Get /api/people selon ID
router.get('/:id', function(req, res, next){
	var personId = req.params.id;

	Person.findById(personId, function(err, person){
		if(err){
			res.status(500).send(err);
			return;
		} else if (!person){
			res.status(404).send('Person not found');
			return;
		}
		res.send(person);
	});
});

//PUT /api/people/:id
router.put('/:id', function(req,res,next){

	var personId = req.params.id;

	Person.findById(personId, function(err, person){
		if(err){
			res.status(500).send(err);
			return;
		}

	person.save(req.body, function(err,updatedPerson){
		if(err){
			res.status(500).send(err);
			return;
		}
		res.send(updatedPerson);

	});
	});

});

//DELETE /api/people/:id
router.delete('/:id', function(req, res, next){

	var personId = req.params.id;

	Person.remove({
		_id: personId
	}, function(err, data){

		if(err){
			res.status(500).send(err);
			return;
		}

		console.log('Deleted' + data.n + 'documents');
		res.sendStatus(204);

	});
});