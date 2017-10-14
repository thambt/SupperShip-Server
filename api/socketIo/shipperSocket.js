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

        // Lawng nghe thay doi vi tri cua Shipper
        socket.on('LocationChange', function (email, longitude, latitude) {
            user.update({ email: email },
                {
                    $set: {
                        "longitude": longitude,
                        "latitude": latitude
                    }
                }, function (err, result) {
                    if (err == null)
                        res.json({ "status": true })
                })
        })
    })
}