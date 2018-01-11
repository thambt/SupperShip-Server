var user = require("../model/user");
const LocalStrategy = require('passport-local').Strategy
var logout = require('express-passport-logout');
var product = require("../model/product");
var userShipper = require("../model/userShipper")
var bill = require("../model/bill")
var passport = require('passport');



function getuser(res) {
    user.find(function (err, users) {
        if (err)
            res.send(err)
        else
            res.json(users)
    })
}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.end('Not logged in');
}

module.exports = function (app, passport) {

    // create a new user
    app.post("/user/register", function (req, res) {
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
    })

    // Login
    app.get("/user/login/:email/:pass", function (req, res, next) {
        passport.authenticate('local', function(err, user, info) {
            if (err)
                return next(err);
            if(!user)
                return res.json({ "resNumber": -1 });
            req.logIn(user, function(err) {
                if (err)
                    res.json({ "resNumber": 0 });
                if (!err)
                    res.json({ "resNumber": 1, "user": result })
                
            });
        })(req, res, next);
    })
  

    // getShipper by email
    app.get("/customer/getShipperByEmail/:email", function (req, res) {
      //  console.log("aaaaaaaaceferb")
        user.findOne({ email: req.params.email }, function (err, result) {
            if (result != null)
               res.json({ "status": true, "user": result })
            else {
                res.json({ "status": false })
            }
        })
    });

    // update user
    app.post("/user/updateUser", function (req, res) {
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
                if (err == null) {
                    bill.update({ emailShop: req.body.email },
                        {
                            $set: {
                                "phoneShop": req.body.phone,
                                "addressShop": req.body.address
                            }
                        }, 
                        {multi: true}
                        , function (err, result) {

                        })

                        product.update({ emailShop: req.body.email },
                        {
                            $set: {
                                "phoneShop": req.body.phone,
                                "addressShop": req.body.address
                            }
                        },
                        {multi: true}
                        , function (err, result) {

                        })
                    res.json({ "status": true })

                }
            })
    })

    // update pwd user
    app.post("/user/updatePwd", function (req, res) {
        user.update({ email: req.body.email },
            {
                $set: {
                    "password": req.body.password
                }
            }, function (err, result) {
                if (err == null)
                    res.json({ "status": true })
            })
    })

    // logout
    app.get('/logout', function (req, res) {
        req.logout();
        res.send("bye!");
    });
}