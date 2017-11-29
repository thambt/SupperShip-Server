var mongoose=require("mongoose");

var schema = mongoose.Schema;
var itemProduct= new schema({
    idProduct :String,
    numBuy: Number
});

module.exports=itemProduct;