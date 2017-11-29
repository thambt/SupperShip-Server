var user = require("../model/user");
var bill = require("../model/bill")
var product = require("../model/product")
var noti = require("../model/notiShop")

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
        socket.on("shopAcceptBill", function (emailShop, nameShop, emailCustomer, code, idBill, time) {
            //  console.log('shopAcceptBill')
            bill.findById(idBill, function (err, data) {
                if (data != null) {
                    var action;
                    if (code == 1)
                        action = 'chấp nhận'
                    else
                        action = 'từ chối'
                    var newNoti = {
                        myEmail: data.emailCustomer,
                        nameActor: nameShop,
                        emailActor: data.emailShop,
                        content: action,
                        idBill: result._id,
                        isRead: false,
                        status: code,
                        time: time
                    };
                    user.findOneAndUpdate({ email: data.emailCustomer }, { $push: { listNoti: newNoti } }, { safe: true, upsert: true, new: true },
                        function (err, User) {
                            // console.log("create Noti", User)
                        })
                    if (data != null) {
                        if (code == 1) {
                            bill.update({ _id: idBill }, { $set: { "status": 0 } }, function (err, result) {
                                if (result != null) {
                                    socket.broadcast.emit("customerNoti", { "emailCustomer": emailCustomer })
                                }
                            })
                        } else {
                            bill.remove({ _id: idBill }, function (err, result) {
                                if (err == null) {
                                    socket.broadcast.emit("customerNoti", { "emailCustomer": emailCustomer })
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
            // console.log("haveNewBill",idBill)
            bill.findById(idBill, function (err, data) {
                if (data != null) {
                    bill.update({ _id: idBill }, { $set: { "status": 1 } }, function (err, result) {
                        if (result != null) {
                            socket.broadcast.emit("shipperHaveNewBill", { "emailShop": emailShop, "idBill": idBill, "time": time, "longitude": longitude, "latitude": latitude })
                        }
                    })
                }
                else {
                    socket.broadcast.emit("shopBillNotFound", { "idBill": idBill, "emailShop": emailShop })
                }
            })
        })

        // Shipper đắng ký nhận đơn hành của shop:
        socket.on("shipperRegister", function (idBill, emailShipper, nameShipper, time) {
            //  console.log(idBill)
            bill.findById(idBill, function (err, data) {
                if (data != null) {
                    if (data.status == 1) {
                        var newNoti = {
                            myEmail: data.emailShop,
                            nameActor: nameShipper,
                            emailActor: emailShipper,
                            content: " đăng ký chuyển hàng",
                            idBill: idBill,
                            isRead: false,
                            status: 1,
                            time: time
                        };
                        user.findOneAndUpdate({ email: data.emailShop }, { $push: { listNoti: newNoti } }, { safe: true, upsert: true, new: true },
                            function (err, result) {
                                //  console.log("create Noti", data)
                            })
                        bill.findOneAndUpdate({ _id: idBill }, { $push: { listShipperRegister: emailShipper } }, { safe: true, upsert: true, new: true },
                            function (err, result) {
                                // console.log("create Noti", data)
                            })
                        // console.log("send ", idBill)
                        socket.broadcast.emit("shopNoti", { "emaiShop": data.emailShop })
                    }
                    else {
                        var newNoti = {

                            myEmail: emailShipper,
                            nameActor: '',
                            emailActor: data.emailShop,
                            content: " Đơn hàng bạn muốn chuyển đã có shipper ",
                            idBill: idBill,
                            isRead: false,
                            status: 401,
                            time: time
                        };
                        user.findOneAndUpdate({ email: emailShipper }, { $push: { listNoti: newNoti } }, { safe: true, upsert: true, new: true },
                            function (err, result) {
                                //  console.log("create Noti", data)
                            })
                        socket.broadcast.emit("shipperNoti", { "myEmail": emailShipper })// 1 la Bill da co ship roi
                    }
                }
                else {
                    var newNoti = {
                        myEmail: emailShipper,
                        nameActor: "",
                        emailActor: "",
                        content: " Đơn hàng bạn muốn chuyển đã bị hủy ",
                        idBill: idBill,
                        isRead: false,
                        status: 400,
                        time: time
                    };
                    user.findOneAndUpdate({ email: emailShipper }, { $push: { listNoti: newNoti } }, { safe: true, upsert: true, new: true },
                        function (err, result) {
                            //  console.log("create Noti", data)
                        })
                    socket.broadcast.emit("shipperNoti", { "myEmail": emailShipper })// 0 laf bill k con ton tai
                }
            })
        })


        // shop accept shipper
        socket.on("shopAcceptShipper", function (code, idBill, time, emailShipper, emailShop, nameShop) {
            // console.log("shopAcceptShipper", emailShipper)
            bill.findById(idBill, function (err, data) {
                if (data != null) {
                    user.findOne({ email: emailShipper }, function (err, userShipper) {
                        if (err == null) {
                            if (code == 1) {
                                var newNoti = {
                                    myEmail: emailShipper,
                                    nameActor: nameShop,
                                    emailActor: data.emailShop,
                                    content: " đồng ý yêu cầu chuyển hàng của bạn ",
                                    idBill: idBill,
                                    isRead: false,
                                    status: 200,
                                    time: time
                                };
                                user.findOneAndUpdate({ email: emailShipper }, { $push: { listNoti: newNoti } }, { safe: true, upsert: true, new: true },
                                    function (err, data) {
                                        //console.log("create Noti", data)
                                    })
                                bill.update({ _id: idBill }, { $set: { "status": 2, emailShipper: emailShipper, phoneShipper: userShipper.phone } }, function (err, result) {
                                    if (result != null) {
                                        socket.broadcast.emit("shipperShopAcceptYou", { "idBill": idBill, "status": 1, "emailShop": emailShop, "emailShipper": emailShipper })
                                    }
                                })
                            }
                        }
                    })

                } else {
                    socket.broadcast.emit("shopBillNotFound", { "idBill": idBill, "emailShop": emailShop })
                }
            })

        })

        socket.on("cBuy", function (arrProduct, userCustomer, time, methodTransform) {
            // console.log(time)
            Array.from(arrProduct).forEach(function (element) {
                user.findOne({ email: element.email }, function (err, result) {
                     console.log("find a user", result)
                    if (err == null) {
                        var newBill = {
                            emailShop: element.email,
                            emailCustomer: userCustomer.email,
                            phoneShop: result.phone,
                            phoneCustomer: userCustomer.phone,
                            phoneShipper: '',
                            addressCustomer: userCustomer.address,
                            addressShop: result.address,
                            status: -1,
                            listProductIds: element.listProduct,
                            moneyItem: 300000,
                            moneyShip: 20000,
                            time: '',
                            note: "String",
                            methodTransform: methodTransform,
                            listRegisterShippers: ""
                        } 
                        bill.create(newBill, function (err, result) {
                            if (err == null) {
                                // console.log("create Bill", result)
                                var newNoti = { 
                                    myEmail: result.emailShop,
                                    nameActor: userCustomer.name,
                                    emailActor: userCustomer.email,
                                    content: "mua hàng",
                                    idBill: result._id,
                                    isRead: false,
                                    status: 0,
                                    time: time
                                };
                                user.findOneAndUpdate({ email: result.emailShop }, { $push: { listNoti: newNoti } }, { safe: true, upsert: true, new: true },
                                    function (err, data) {
                                        // console.log("create Noti", data)
                                    })
                                socket.broadcast.emit("shopNoti", { "emailCustom": userCustomer.email, "phoneCustomer": userCustomer.phone, "emailShop": element.email, "idBill": result._id, "action": " mua hang " })
                            }
                        })
                    }
                })

            })
        })
    })
}