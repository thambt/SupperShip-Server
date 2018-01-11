var user = require("../model/user");
var passport = require('passport');

module.exports = {};


module.exports.register = function(req, res) {
    user.findOne({ email: req.body.email }, function (err, result) {

            if (result == null) {
                user.create(req.body, function (err, result) {
                    if (!err)
                        res.json({ "status": true })
                })
            }
            else
                res.json({ "status": false });
        })
};

module.exports.login = function(req, res, next) {
  //  console.log(req)
   passport.authenticate('local', function(err, user, info) {
       console.log(user)
            if (err)
                return next(err);
            if(!user)
                return res.json({SERVER_RESPONSE: 0, SERVER_MESSAGE: "Wrong Credentials"});
            req.logIn(user, function(err) {
                if (err)
                    return next(err);
                if (!err)
                    return res.json({ SERVER_RESPONSE: 1, SERVER_MESSAGE: "Logged in!",  "user": user });
                
            });
        })(req, res, next);
};

module.exports.updateUser = function(req, res) {
   user.update({ email: req.body.email },
            {
                $set: {
                    "name": req.body.name,
                    "phone": req.body.phone,
                    "address": req.body.address,
                    "image": req.body.image,
                    "gender": req.body.gender,
                    "licen": req.body.licen
                }
            }, function (err, result) {
                if(result)
                 res.json({ "status": true })
            })
}; //getNotifi

module.exports.getNotifi = function(req, res) {
   var myNoti = new Array();
        user.findOne({ email: req.params.email }, function (err, result) {
            if (result != null) {
                //   console.log(result)
                Array.from(result.listNoti).forEach(function (element) {
                    myNoti.push(element)
                })
            }
            res.json({ "listNoti": myNoti })
            // console.log(myNoti)
        })
};