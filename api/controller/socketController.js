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
    /*    socket.on("cBuy", function(arrProduct, userCustomer) {
            console.log(arrProduct)
            Array.from (arrProduct).forEach(function(element) {
                  console.log(element._id)
                  product.findById( element._id,function (err, result) {
                    if (!err)
                    {
                        var newBill = {
                            emailShop:result.emailShop,
                            emailCustomer: userCustomer.email,
                            phoneSend: result.phoneShop,
                            phoneReceive: userCustomer.phone,
                            phoneShipper: '',
                            addressReceive: userCustomer.address,
                            addressSend: addressShop,
                            status: 0,
                            category: result.category,
                            idProduct: element._id,
                            moneyItem: 300000,
                            moneyShip: 20000,
                            time: 123458784,
                            note: "String"
                        }
                        bill.create(newBill, function(err,result) {
                            if(!err){
                                socket.broadcast.emit("SopNewBill", {"emailCustom": userCustomer.email,"phoneCustomer": userCustomer.phone,"addressCustomer": userCustomer.address ,"idProduct" : element._id,"emailShop": result.emailShop, "idBill": result._id})    
                            }
                        })
                        }
                })
            }) 
        })*/
    })
}