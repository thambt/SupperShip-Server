var mongoose = require("mongoose");

var schema = mongoose.Schema;
var infoShipper = new schema({
    avatar: String,
     name: String,
     email: String,
     phone: String
});

module.exports = infoShipper;