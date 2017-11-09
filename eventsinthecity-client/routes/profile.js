/*
 * Created by Anushka Jain
*/

var ejs = require("ejs");
var mysql = require('./mysql');
var mongo = require("./mongoConnect");
var mongoURL = "mongodb://ec2-54-183-239-166.us-west-1.compute.amazonaws.com:27017/cmpe295";

var output = [];
exports.getProfileInfo = function(req, res){
    var connection = mysql.getConnection();
    connection.query("select * from users where email = '"+ req.session.email + "'" ,function(err,rows){
        if(rows.length>0){
            //console.log("This is data:" + JSON.stringify(rows));
            //console.log(rows.firstname);

            var data ={userdetails:rows};
           // console.log(data.userdetails[0].firstname);
            user={};
            user.firstname =data.userdetails[0].firstname;
            user.lastname=data.userdetails[0].lastname;
            user.address=data.userdetails[0].address;

            output.push(user)
            console.log(output)

        }
    });

    mongo.connect(mongoURL, function(db) {
        var coll1 = db.collection('userevents');
        coll1.find().toArray(function(err, result) {
            if (result.length) {
                console.log("inside profile")
                for(var i = 0; i < result.length; i++) {
                    event={};
                    event.userid = result[i].userid;
                    event.id=result[i].id;
                    event.type=result[i].type;
                    event.category=result[i].category;
                    //  console.log(event)
                    output.push(event);
                }

            } else {
                console.log(err)
            }
        })
        db.close();
    });


    res.render('profile',{
    	values: output
    });
};