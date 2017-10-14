var mongoose=require("mongoose");

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
    licen: { type: String, default: 0 }
});
var user=mongoose.model("users",frameUser);

module.exports=user;