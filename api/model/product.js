var mongoose=require("mongoose");
var color = require("./color")

var schema = mongoose.Schema;
var frameProduct= new schema({
    emailShop:String,
    addressShop: String,
    phoneShop: String,
    kind: String,
    image: String,
    price: String,
    quantity: String,
    weight: String,
    name: String,
    detail: String,
    numBuy: { type: String, default: "0" },
    guarantee: { type: String, default: "0" }
});
var produce=mongoose.model("products",frameProduct);

module.exports=produce;