var mongoose=require("mongoose");

var schema = mongoose.Schema;
var frameBill= new schema({
    emailShop:String,
    emailCustomer: String,
    emailShipper: { type: String, default: '' },
    phoneShop: String,
    phoneCustomer: String,
    phoneShipper: String,
    addressShop: String,
    addressCustomer: String,
    weight: String,
    listProductIds: [String],
    methodTransform: Number,
    moneyItem: String,
    moneyShip: String,
    time: String,
    note: String,
    status: Number,

    listRegisterShippers: [String],
});
var bill=mongoose.model("bills",frameBill);

module.exports=bill;