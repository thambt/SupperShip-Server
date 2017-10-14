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

            console.log(socket.id + " disconnect");
        })
    })

    // Lang nghe su kien Bill co Shipper nhan
    socket.on("onHaveShipper", function (emailS, idBill) {
        bill.findOne({ id: idBill }, function (err, result) {
            const customer = bill.emailCustomer;
            user.findOne({ email: email }, function (err, result) {
                io.sockets.emit("emitNotiHaveShipper", {
                    "shipper": result,
                    "customer": customer
                });
            })
        })
    })
}