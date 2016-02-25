//Get /api/v1/citizen
//get the list of all citizen
router.get('/api/v1/users/citizen', function(req, res, next){
	User.nameRole.find(function (err,user){
		if (err){
			res.status(500).send(err);
			return;
		}
	res.send(user);
	});
});

