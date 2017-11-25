var mongoose=require("mongoose");

var schema = mongoose.Schema;
var userShipper= new schema({
    email:String,
    name: String,
    times: Number,
    km: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
});
var userShipper=mongoose.model("userShippers",userShipper);

module.exports=userShipper;

