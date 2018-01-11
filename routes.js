var usertemp  = require('./api/controller/usertemp');
var users  = require('./api/controller/bussinessController');
var express = require('express');

module.exports = function(app, passport) {

// Login [x]
    app.post('/user/login', usertemp.login);

    // Register [x]
    app.post('/user/register', usertemp.register); 

    // updateUser
    app.post("/user/updateUser",isLoggedIn, usertemp.updateUser);

    // getNoti
    app.get("/user/getNoti/:email",isLoggedIn,usertemp.getNotifi) ;
}

function isLoggedIn(req, res, next) {
    console.log("check",req.isAuthenticated())
    if (req.isAuthenticated())
        return next();
    res.end('Not logged in');
}