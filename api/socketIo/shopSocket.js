var socketID = new Array();
var user = require("../model/user");
var bill = require("../model/bill");
var product = require("../model/product");

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

            console.log(socket.id + "disconnect");
        })

        // Lang nghe co Shipper dang ky nhan Bill
        socket.on('registerTransfer', function (idBill, emailShipper) {
            user.findOne({email: emailShipper}, function(err, result) {
                if(!result) {
                    var shipper = result;
                    bill.findById(idBill, function(err, result) {
                        if(!result) {
                            socket.io.emit('haveRegisterTransfer', {"shipper": shipper, "emailShop": result.emailShop})
                        }
                    })
                }
            })
        })
    })
}