var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var passport = require('passport');
var io = require('socket.io')(http);
var userControllers = require("./api/controller/userController");
var bussinessController = require("./api/controller/bussinessController");
var socketController= require("./api/controller/socketController")
const config = require('./api/config/database');


var app = express();
var port = process.env.PORT || 3000;

var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + "/"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(session({ secret: "mysecret" }))
app.use(passport.initialize())
app.use(passport.session())

app.use(passport.initialize());
app.use(passport.session());

var Users = require('./api/model/user')


app.set("view engine", "ejs");

mongoose.connect(config.database);

userControllers(app, passport);
bussinessController(app,passport, io);
socketController(io);

http.listen(port, function () {
    console.log("Server is connecting in port: " + port);
})