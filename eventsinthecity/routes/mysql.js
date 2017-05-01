/**
 * Created by aartichella on 5/1/17.
 */
/**
 * New node file
 */
var mysql = require("mysql");
var db = {
    "host"     : 'cmpe295a.cum1koe02itt.us-east-1.rds.amazonaws.com',
    "user"     : 'cmpe295a',
    "password" : 'abcd1234',
    "database" : 'cmpe295a',
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


