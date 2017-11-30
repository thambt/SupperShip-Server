var mongoose=require("mongoose");
const config = require('../config/database');
var noti = require("./notiShop")

var schema = mongoose.Schema;
var frameUser= new schema({
    email:String,
    name: String,
    password: String,
    phone: String,
    image: String,
    address: String,
    status: Number,
    gender: Boolean,
    kindUser: Number,
    longitude: { type: Number, default: -1 },
    latitude: { type: Number, default: -1 },
    licen: { type: String, default: 0 },
    listNoti: [noti],
    levelShipper: { type: Number, default: 1 }
});
var user=mongoose.model("users",frameUser);

module.exports=user;