var mongoose = require("mongoose");
var itemProduct = require("./itemProduct")
var infoShipper = require("./infoShipper")

var schema = mongoose.Schema;
var frameBill = new schema({
    emailShop: String,
    emailCustomer: String,
    emailShipper: { type: String, default: '' },
    phoneShop: String,
    phoneCustomer: String,
    phoneShipper: String,
    addressShop: String,
    addressCustomer: String,
    weight: String,
    listProducts: [itemProduct],
    methodTransform: Number,
    moneyItem: String,
    moneyShip: String,
    time: String,
    note: String,
    status: Number,

    timeCreate: String,
    timeShipping: String,
    timePlanShip: String,
    distance: String,
    listRegisterShippers: [infoShipper],
});
var bill = mongoose.model("bills", frameBill);

module.exports = bill;