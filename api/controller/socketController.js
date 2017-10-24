var user = require("../model/user");
var bill = require("../model/bill")
var product = require("../model/product")

var socketID = new Array();
var check = 0;
module.exports = function (io) {
    io.sockets.on('connection', function (socket) {
        console.log("co nguoi ket noi");

        socket.on('email', function (data) {
            socket.id = data;
            socketID.forEach(function (element) {
                if (socket.id === element) {
                    check = 1;
                }
            }, this);
            if (check === 0) {
                socketID.push(socket.id);
            }
            else {
                check = 0;
            }
        });

        socket.on('disconnect', function () {
            console.log(socket.id + " disconnect");
        })
        socket.on("cBuy", function(arrProduct, userCustomer) {
            console.log(arrProduct[0])
            /* arrProduct.forEach(function(element) {
                product.findById(element._id,function(result, err){
                    if(!result) {
                        socket.broadcast.emit("SopNewBill", {"userCustomer" : userCustomer, "isProduct" : element._id,"idShop": result._id})
                    }
                })
            }) */
        })
    })
}