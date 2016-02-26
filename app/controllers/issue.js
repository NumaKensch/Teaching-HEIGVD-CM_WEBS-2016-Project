var express = require('express'),
router = express.Router(),
mongoose = require('mongoose'),
Issue =mongoose.model('Issue');
User =mongoose.model('User');
Comment =mongoose.model('Comment');

module.exports = function (app) {
	app.use('/api/v1/issues', router);
};

function findIssue(req, res, next){
	console.log(req.params.id);
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

		req.issue.action.push(action);
		req.issue.save(function(err) {
			if(err){
				res.status(500).send(err);
				return;
			}

			res.send(action);
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

			console.log('Deleted' + data.n + 'documents');
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
