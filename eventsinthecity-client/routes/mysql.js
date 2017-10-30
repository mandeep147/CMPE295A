/**
 * Created by aartichella on 5/1/17.
 * Updated by anushka on 10/21/2017
 */

var mysql = require("mysql");
var db = {
		"host"     : 'cmpe295.cwqcbn87lmnm.us-west-1.rds.amazonaws.com',
	    "user"     : 'cmpe295',
	    "password" : 'abcd1234',
	    "database" : 'eventsInTheCity',
	    "port"	 : 3306
};

exports.getConnection = function(){
    var connection= mysql.createConnection({
        host     : db.host,
        user     : db.user,
        password : db.password,
        database : db.database,
        port	 : db.port
    });
    return connection;
};


