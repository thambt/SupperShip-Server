var mongoose=require("mongoose");

var schema = mongoose.Schema;
var noti= new schema({
    emailShop:String,
    nameActor: String,
    action: String,
    idBill: String,
    read: Boolean,
    status: Number,
    time: Number
});

module.exports=noti;