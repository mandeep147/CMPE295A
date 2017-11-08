/*
 * Created by Anushka Jain
*/

var ejs = require("ejs");
var mysql = require('./mysql');


exports.getProfileInfo = function(req, res){
	var connection = mysql.getConnection();
    connection.query("select * from users where email = '"+ req.session.email + "'" ,function(err,rows){
        if(rows.length>0){
        	console.log("This is data:" + JSON.stringify(rows));
        	console.log(rows.firstname);
        	
        	var data ={userdetails:rows};
        	console.log(data.userdetails[0].firstname);
        	
        	res.render('profile',{firstname : data.userdetails[0].firstname, lastname : data.userdetails[0].lastname , address: data.userdetails[0].address});
            
        }
        
    });
	
	
	//res.render('profile');
};