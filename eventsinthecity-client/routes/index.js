
/*
 * GET home page.
 */

exports.index = function(req, res){
	console.log(JSON.stringify(req.session.email));
	
	req.session.destroy();
  res.render('index', { title: 'Events in the City' });
};
exports.homepage = function(req, res){
  res.render('homepage', { title: 'Events in the City' });
};

exports.clickOnLoginButton = function(req,res){
	res.render('signin', {title: 'Events in the City'});
};

exports.about = function(req,res){
	res.render('about');
}