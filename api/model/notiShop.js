var mongoose=require("mongoose");

var schema = mongoose.Schema;
var noti= new schema({
    emailShop:String,
    nameActor: String,
    action: String,
    idBill: String
});

module.exports=noti;