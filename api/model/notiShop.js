var mongoose=require("mongoose");

var schema = mongoose.Schema;
var noti= new schema({
    myEmail:String,
    nameActor: String,
    action: String,
    idBill: String,
    read: Boolean,
    status: Number,
    methodTransform: Number,
    time: Number
});

module.exports=noti;