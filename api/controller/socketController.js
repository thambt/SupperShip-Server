var user = require("../model/user");
var bill = require("../model/bill")
var product = require("../model/product")
var noti = require("../model/notiShop")
var userShipper = require("../model/userShipper")


var socketID = new Array();
var check = 0;
module.exports = function (io) {
    io.sockets.on('connection', function (socket) {
        console.log("co nguoi ket noi");

        socket.on('email', function (data, kindUser) {
            socket.id = data;
            socket.join('roomShipper');
            socketID.forEach(function (element) {
                if (socket.id === element) {
                    check = 1;
                }
            }, this);
            if (check === 0) {
                socketID.push(socket.id);
                //  socket.join('roomShipper');
            }
            else {
                check = 0;
            }
        });

        socket.on('disconnect', function () {
            console.log(socket.id + " disconnect");
        })

        // gửi sự kiện cho khách khi shop accept/deny đơn hàng
        socket.on("shopAcceptBill", function (emailShop, emailCustomer, code, idBill, time) {
            console.log('shopAcceptBill')
            bill.findById(idBill, function (err, data) {
                if (data != null) {

                    var newNoti = {
                        nameActor: data.emailShop,
                        myEmail: data.emailCustomer,
                        action: code,// 1: accept; 0: deny
                        idBill: idBill,
                        read: false,
                        status: 0,
                        time: time,
                        method: data.methodTransform
                    };
                    user.findOneAndUpdate({ email: data.emailCustomer }, { $push: { listNoti: newNoti } }, { safe: true, upsert: true, new: true },
                        function (err, data) {
                            console.log("create Noti", data)
                        })
                    if (data != null) {
                        if (code === 1) {
                            bill.update({ _id: idBill }, { $set: { "status": code } }, function (err, result) {
                                if (result != null) {
                                    socket.broadcast.emit("shopAcceptYourBill", { "code": code, "idBill": idBill, "emailCustomer": emailCustomer, "emailShop": emailShop })
                                }
                            })
                        } else {
                            bill.remove({ _id: idBill }, function (err, result) {
                                if (err == null) {
                                    socket.broadcast.emit("shopAcceptYourBill", { "code": code, "idBill": idBill, "emailCustomer": emailCustomer, "emailShop": emailShop })
                                }
                            })
                        }

                    }

                }
                else {
                    socket.broadcast.emit("shopBillNotFound", { "idBill": idBill, "emailShop": emailShop })

                }
            })

        })


        // gửi broadcast cho shipper khi có bill mới:
        socket.on("haveNewBill", function (emailShop, idBill, time, longitude, latitude) {
            console.log("haveNewBill", idBill)
            bill.findById(idBill, function (err, data) {
                if (data != null) {
                    bill.update({ _id: idBill }, { $set: { "status": 2 } }, function (err, result) {
                        if (result != null)
                            socket.broadcast.emit("shipperHaveNewBill", { "emailShop": emailShop, "idBill": idBill, "time": time, "longitude": longitude, "latitude": latitude })
                    })
                }
                else {
                    socket.broadcast.emit("shopBillNotFound", { "idBill": idBill, "emailShop": emailShop })
                }
            })
        })

        // Shipper đắng ký nhận đơn hành của shop:
        socket.on("shipperRegister", function (idBill, emailShipper) {
            //  console.log(idBill)
            bill.findById(idBill, function (err, data) {
                if (data != null) {

                    if (data.status == 2) {
                        userShipper.findOne({ email: emailShipper }, function (err, UserShipper) {
                            if (UserShipper != null) {
                                bill.findOneAndUpdate({ _id: idBill }, { $push: { listShipperRegister: UserShipper } }, { safe: true, upsert: true, new: true },
                                    function (err, result) {
                                        console.log("create Noti", result)
                                    })
                            }
                        })
                        var newNoti = {
                            nameActor: data.emailShipper,
                            myEmail: data.emailShop,
                            action: "shipper register",
                            idBill: idBill,
                            read: false,
                            status: 0,
                            time: time,
                            method: data.methodTransform
                        };
                        user.findOneAndUpdate({ email: data.emailShop }, { $push: { listNoti: newNoti } }, { safe: true, upsert: true, new: true },
                            function (err, result) {
                                console.log("create Noti", data)
                            })
                        console.log("send ", idBill)
                        socket.broadcast.emit("haveShipperRegister", { "idBill": idBill, "emailShipper": emailShipper, "emaiShop": data.emailShop })
                    }
                    else {
                        socket.broadcast.emit("shipperBillHaveShip", { "idBill": idBill, "status": 1, "emailShipper": emailShipper })// 1 la Bill da co ship roi
                    }
                }
                else {
                    socket.broadcast.emit("shipperBillHaveShip", { "idBill": idBill, "status": 0, "emailShipper": emailShipper })// 0 laf bill k con ton tai
                }
            })
        })


        // shop accept shipper
        socket.on("shopAcceptShipper", function (code, idBill, time, emailShipper) {
            bill.findById(idBill, function (err, data) {
                if (data != null) {
                    user.findOne({ email: emailShipper }, function (err, userShipper) {
                        if (err == null) {
                            var newNoti = {
                                nameActor: data.emailShop,
                                myEmail: emailShipper,
                                action: code,
                                idBill: idBill,
                                read: false,
                                status: 0,
                                time: time,
                                method: data.methodTransform
                            };
                            user.findOneAndUpdate({ email: emailShipperr }, { $push: { listNoti: newNoti } }, { safe: true, upsert: true, new: true },
                                function (err, data) {
                                    console.log("create Noti", data)
                                })
                            if (code == 1) {
                                bill.update({ _id: idBill }, { $set: { "status": 2, emailShipper: emailShipper, phoneShipper: userShipper.phone } }, function (err, result) {
                                    if (result != null) {
                                        socket.broadcast.emit("shipperShopAcceptYou", { "idBill": idBill, "status": 1, "emailShop": newNoti.nameActor, emaiShipper: emailShipper })
                                    }
                                })
                            }
                        } else {
                            socket.broadcast.emit("ShopResponeShopAcceptYou", { "idBill": idBill, "code": 0, "emailShop": newNoti.nameActor, emaiShipper: emailShipper })
                        }
                    })

                }
            })

        })

        socket.on("cBuy", function (arrProduct, userCustomer, time, methodTransform) {
            console.log(time)
            Array.from(arrProduct).forEach(function (element) {
                user.findOne({ email: element.email }, function (err, result) {
                    console.log("find a user", result)
                    if (err == null) {
                        var newBill = {
                            emailShop: element.email,
                            emailCustomer: userCustomer.email,
                            phoneSend: result.phone,
                            phoneReceive: userCustomer.phone,
                            phoneShipper: '',
                            addressReceive: userCustomer.address,
                            addressSend: result.address,
                            status: 0,
                            listProduct: element.listProduct,
                            moneyItem: 300000,
                            moneyShip: 20000,
                            time: '',
                            note: "String",
                            methodTransform: methodTransform
                        }
                        bill.create(newBill, function (err, result) {
                            if (err == null) {
                                console.log("create Bill", result)
                                var newNoti = {
                                    myEmail: result.emailShop,
                                    nameActor: userCustomer.email,
                                    action: "mua hang",
                                    idBill: result._id,
                                    read: false,
                                    status: 0,
                                    time: time,
                                    method: methodTransform
                                };
                                user.findOneAndUpdate({ email: result.emailShop }, { $push: { listNoti: newNoti } }, { safe: true, upsert: true, new: true },
                                    function (err, data) {
                                        console.log("create Noti", data)
                                    })
                                socket.broadcast.emit("SopNewBill", { "emailCustom": userCustomer.email, "phoneCustomer": userCustomer.phone, "emailShop": element.email, "idBill": result._id, "action": " mua hang " })
                            }
                        })
                    }
                })

            })
        })
    })
}