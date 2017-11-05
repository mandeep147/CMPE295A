
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('homepage', { title: 'Events in the City' });
};

exports.clickOnLoginButton = function(req,res){
	res.render('index', {title: 'Events in the City'});
};