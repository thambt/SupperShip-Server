var mongoose=require("mongoose");

var schema = mongoose.Schema;
var noti= new schema({
    myEmail:String,
    nameActor: String,
    emailActor: String,
    content: String,
    idBill: String,
    isRead: Boolean,
    status: Number,
    time: Number
});

module.exports=noti;