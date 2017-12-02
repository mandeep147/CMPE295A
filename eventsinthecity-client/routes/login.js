/**
 * Created by aartichella on 5/1/17.
 */
var ejs = require("ejs");
var mysql = require('./mysql');
var encryption = require('./encryption');

exports.loginRequest = function(req,res){
    //console.log(req.body);
    var email = req.body.username;
    var password = req.body.password;
    var encrypted_password=encryption.encrypt(password);
    //console.log("This is encrypted password" + encrypted_password);
    var connection = mysql.getConnection();
    connection.query("select * from users where email = '"+ email + "' and password = '" + encrypted_password +"'" ,function(err,rows){
        if(rows.length>0){
        	sess = req.session;
        	sess.email=email;
            console.log("In success");
            res.send({status:200});
        }
        else{
            console.log("Incorrect user details");
            res.send({status:400});
        }
    });
};

exports.register = function(req,res){
    var connection = mysql.getConnection();
    //console.log("This is after /register api call:" + JSON.stringify(req.body));
    var password = req.body.password;
    var encrypted_password = encryption.encrypt(password);

    var data = {email: req.body.email,
        password: encrypted_password,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        phone: req.body.mobile,
        address:req.body.address
    };
    //console.log(data);
    connection.query("insert into users set ?", data, function(err,rows){
        if(!err){
            req.session.firstname=data.firstname;  //for displaying hi "name" on homepage

            //console.log("Successful");
            res.send({status:200, firstname: req.session.firstname});
        }
        else{
            res.send({status:400});
        }
    });
};

exports.logout = function(req,res){
	//console.log(JSON.stringify(req.session.email));

	req.session.destroy();
	res.render('index');
};
