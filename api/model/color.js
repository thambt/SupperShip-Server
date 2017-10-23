var mongoose=require("mongoose");
const config = require('../config/database');

var schema = mongoose.Schema;
var color= new schema({
    nameC:String,
    quantityC: String
});
module.exports=color;