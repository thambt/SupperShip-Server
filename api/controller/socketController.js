var user = require("../model/user");
var bill = require("../model/bill")
var product = require("../model/product")
var noti = require("../model/notiShop")

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
        socket.on("cBuy", function (arrProduct, userCustomer) {
            console.log(arrProduct)
            Array.from(arrProduct).forEach(function (element) {
               user.findOne({ email: element.email }, function (err, result) {
                    console.log("find a user",result)
                    var newBill = {
                        emailShop: element.emailShop,
                        emailCustomer: userCustomer.email,
                        phoneSend: result.phone,
                        phoneReceive: userCustomer.phone,
                        phoneShipper: '',
                        addressReceive: userCustomer.address,
                        addressSend: result.addressShop,
                        status: 0,
                        listProduct: element.listProduct,
                        moneyItem: 300000,
                        moneyShip: 20000,
                        time: '',
                        note: "String"
                    }
                    bill.create(newBill, function (err, result) {
                        if (!err) {
                            var newNoti = {
                                emailShop: result.emailShop,
                                nameActor: userCustomer.email,
                                action: "mua hang",
                                idBill: result._id
                            };
                                   socket.broadcast.emit("SopNewBill", { "emailCustom": userCustomer.email, "phoneCustomer": userCustomer.phone, "addressCustomer": userCustomer.address, "emailShop":element.email, "idBill": result._id, "action": " mua hàng " })
                        }
                    })
                })

               
            })
        })
    })
}

/* user.findOneAndUpdate({ email: element.ownEmail }, { $push: { listNotis: newNoti } }, { safe: true, upsert: true, new: true },
                                */

 /* user.findOneAndUpdate({ email: result.emailShop }, { $push: { listNoti: newNoti } }, { safe: true, upsert: true, new: true },
                                function (err, data) {
                                    console.log("errcreateNot", err)
                                    console.log( userCustomer.email +" "+ userCustomer.phone +" "+userCustomer.address +" "+element.email +" "+ result._id)
                                    socket.broadcast.emit("SopNewBill", { "emailCustom": userCustomer.email, "phoneCustomer": userCustomer.phone, "addressCustomer": userCustomer.address, "emailShop":element.email, "idBill": result._id, "action": " mua hàng " })
                                })*/

 /*element.listProduct.forEach(function (elementProduct) {
                    product.findById(elementProduct._id, function (err, result) {
                        if (!err) {
                            var newBill = {
                                emailShop: result.emailShop,
                                emailCustomer: userCustomer.email,
                                phoneSend: result.phoneShop,
                                phoneReceive: userCustomer.phone,
                                phoneShipper: '',
                                addressReceive: userCustomer.address,
                                addressSend: result.addressShop,
                                status: 0,
                                category: result.category,
                                weight: result.category,
                                idProduct: elementProduct._id,
                                moneyItem: 300000,
                                moneyShip: 20000,
                                time: '',
                                note: "String"
                            }
                            
                    })
                })*/