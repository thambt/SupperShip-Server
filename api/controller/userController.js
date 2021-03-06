var user = require("../model/user");
const LocalStrategy = require('passport-local').Strategy
var logout = require('express-passport-logout');
var product = require("../model/product");
var userShipper = require("../model/userShipper")
var bill = require("../model/bill")

function getuser(res) {
    user.find(function (err, users) {
        if (err)
            res.send(err)
        else
            res.json(users)
    })
}

module.exports = function (app, passport) {

    passport.use(new LocalStrategy(
        (email, pass, done) => {
            user.findOne({ email: req.params.email }, function (err, result) {
                if (result == null)
                    return done(null, false)
                else {
                    if (result.password == req.params.pass)
                        return done(null, result)
                    else
                        return done(null, false)
                }
            })
        }
    ))

    passport.serializeUser(function (result, done) {
        done(null, result.email)
    })

    passport.deserializeUser(function (email, done) {
        if (username === user.username) {
            return done(null, user)
        }
        return done(null)
    })



    //Home
    app.get('/', (req, res) => {
        res.render('index', { user: req.user });
    });

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
    app.get("/user/login/:email/:pass", function (req, res) {
        console.log("aaaaaaaaceferb")
        user.findOne({ email: req.params.email }, function (err, result) {
            if (result == null)
                res.json({ "resNumber": -1 });
            else {
                if (result.password == req.params.pass)
                    res.json({ "resNumber": 1, "user": result })
                else
                    res.json({ "resNumber": 0 });
            }
        })
    });

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