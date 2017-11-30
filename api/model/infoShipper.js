var mongoose = require("mongoose");

var schema = mongoose.Schema;
var infoShipper = new schema({
    emailShipper: String,
    nameShipper: String
});

module.exports = infoShipper;