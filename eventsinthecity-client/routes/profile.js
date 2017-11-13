var ejs = require("ejs");
var mysql = require('./mysql');
var mongo = require("./mongoConnect");
var mongoURL = "mongodb://ec2-54-183-239-166.us-west-1.compute.amazonaws.com:27017/cmpe295";


exports.getProfileInfo = function(req, res){
    var output = [];
    //console.log("final output")
 //   console.log(output)
    userData(req,res,output);
};


function  userData(req, res, output) {

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

            output.push(user);
          //  console.log("user data");
         //   console.log(output);
            eventData(req, res, output);
        }

    });
}

function eventData(req, res, output) {
    mongo.connect(mongoURL, function(db) {
        var coll1 = db.collection('userevents');
        coll1.find({"userid":req.session.email}).toArray(function(err, result) {
           // console.log("inside profile");
           // console.log(result.length);
            //console.log(result);
            for(var i = 0; i < result.length; i++) {
               //if(result[i].userid == req.session.email){
             //      console.log("true")

                   event={};
                   event.userid = result[i].userid;
                   event.id = result[i].id;
                   event.type = result[i].type;
                  // event.category = result[i].category;
                  //   console.log(event)
                   output.push(event);
               //}
            }

         //   console.log("events");
          //  console.log(output.length)
         //   console.log(output);
         //   getTechDetails(req, res, output)
            searchEventTitle(req, res, output)
        })
        db.close();
    });

}

function getTechDetails(req, res, output){
    for(j = 0; j < output.length; j++){
        if (output[j].type == 'SJTECH' || output[j].type == 'SFTECH') {
            searchEventTitle(req, res, output);
        }else {
            if (output[j].type == 'SJFUN1' || output[j].type == 'SJFUN2' || output[j].type == 'SFFUN') {
                searchFunTitle(req, res, output);
            }
        }
    }

}

function searchEventTitle(req, res, output) {
    mongo.connect(mongoURL, function(db) {
        var techEvent = db.collection('techfunEvents');
        techEvent.find().toArray(function(err, result) {
            if (result.length) {
                for(var j = 0; j < output.length; j++){
                	for (var i = 0; i < result[0].ebEventsSF.length; i++) {
                        if (output[j].id == result[0].ebEventsSF[i].id) {
                            console.log("getSFTechDetails" + result[0].ebEventsSF[i].id)
                            console.log(result[0].ebEventsSF[i].title);
                            output[j].title = result[0].ebEventsSF[i].title;
                            output[j].url = result[0].ebEventsSF[i].url;
                        }
                    }
                    for (var i = 0; i < result[1].ebEventsSJ.length; i++) {
                        if (output[j].id == result[1].ebEventsSJ[i].id) {
                            console.log("getSJTechDetails" + result[1].ebEventsSJ[i].id)
                            console.log(result[1].ebEventsSJ[i].title);
                            output[j].title = result[1].ebEventsSJ[i].title;
                            output[j].url = result[1].ebEventsSJ[i].url;
                        }
                    }
                    for (var i = 0; i < result[2].muSFEvents.length; i++) {
                        if (output[j].id == result[2].muSFEvents[i].id) {
                            console.log("getSFTechDetails" + result[2].muSFEvents[i].id)
                            console.log(result[2].muSFEvents[i].title);
                            output[j].title = result[2].muSFEvents[i].title;
                            output[j].url = result[2].muSFEvents[i].url;
                        }
                    }
                    for (var i = 0; i < result[3].muSJEvents.length; i++) {
                        if (output[j].id == result[3].muSJEvents[i].id) {
                            console.log("getSJTechDetails" + result[3].muSJEvents[i].id)
                            console.log(result[3].muSJEvents[i].title);
                            output[j].title = result[3].muSJEvents[i].title;
                            output[j].url = result[3].muSJEvents[i].url;
                        }
                    }
                    for (var i = 0; i < result[4].funeventsSJ.length; i++) {
                        if (output[j].id == result[4].funeventsSJ[i].id) {
                            console.log("getSJFunDetails" + result[4].funeventsSJ[i].id)
                            console.log(result[4].funeventsSJ[i].title);
                            output[j].title = result[4].funeventsSJ[i].title;
                            output[j].url = result[4].funeventsSJ[i].url;
                        }
                    }
                    for (var i = 0; i < result[5].funeventsSF.length; i++) {
                        if (output[j].id == result[5].funeventsSF[i].id) {
                            console.log("getSFFunDetails" + result[5].funeventsSF[i].id)
                            console.log(result[5].funeventsSF[i].title);
                            output[j].title = result[5].funeventsSF[i].title;
                            output[j].url = result[5].funeventsSF[i].url;
                        }
                    }
                }
            }
            exportData(req,res, output)
        })
    })
}

function searchFunTitle(req, res, output) {
    mongo.connect(mongoURL, function(db) {
        var funEvent = db.collection('funEvents');
        funEvent.find().toArray(function(err, result) {
            if (result.length )  {
                console.log("getFunDetails "+result[0].allEvents[3].id)
                for(var j = 0; j < output.length; j++){
                    for(var i = 0; i < result[0].allEvents.length; i++) {
                        if (output[j].id == result[0].allEvents[i].id ) {
                            console.log("getFunDetails"+result[0].allEvents[i].id)
                            console.log(result[0].allEvents[i].title);
                            output[j].title = result[0].allEvents[i].title;
                            output[j].url = result[0].allEvents[i].url;
                        }
                    }
                }
            }
            //exportData(req, res, output)
        })
    })
}


function exportData(req, res, output) {
    console.log("outside")
    console.log(output);
    res.render("profile", {
        "values": output
    });
}