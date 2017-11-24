var mongoose=require("mongoose");
var userShipper = require("./userShipper")

var schema = mongoose.Schema;
var frameBill= new schema({
    emailShop:String,
    emailCustomer: String,
    emailShipper: { type: String, default: '' },
    phoneSend: Number,
    phoneReceive: Number,
    phoneShipper: Number,
    addressReceive: String,
    addressSend: String,
    status: Number,
    category: String,
    weight: String,
    listProduct: [String],
    listShipperRegister: [userShipper],
    methodTransform: Number,
    moneyItem: Number,
    moneyShip: Number,
    time: String,
    note: String
});
var bill=mongoose.model("bills",frameBill);

module.exports=bill;