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
            console.log('shopAcceptBill', code)
            bill.findById(idBill, function (err, data) {
                // console.log("err",data.emailCustomer)
                if (data != null) {
                    var action;
                    if (code == 1)
                        action = 'Đơn hàng đã được xác nhận'
                    else
                        action = 'Đơn hàng đã bị hủy'
                    var newNoti = {
                        myEmail: data.emailCustomer,
                        nameActor: nameShop,
                        emailActor: data.emailShop,
                        content: action,
                        idBill: idBill,
                        isRead: false,
                        status: 1,
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
                            data.listProducts.forEach(function (elementItem) {

                                product.findById(elementITem.idProduct, function (err, resultFind) {
                                    if (resultFind != null) {
                                        product.findOneAndUpdate({ _id: elementITem.idProduct }, { $set: { quantity: elementITem.numBuy + parseInt(resultFind.quantity, 10) } }, { safe: true, upsert: true, new: true },
                                            function (err, data) {
                                                //console.log("create Noti", parseInt(result.quantity, 10) - elementITem.numBuy)
                                            })
                                    }
                                })
                            })

                            bill.remove({ _id: idBill }, function (err, result) {
                                if (err == null) {
                                    socket.broadcast.emit("customerNoti", { "emailCustomer": emailCustomer })
                                }
                            })
                        }
                    }

                    // Xóa notify
                    user.update({ email: emailShop },
                        { $pull: { "listNoti": { idBill: idBill } } },
                        function (err, result) {
                            if (err != null)
                                console.log(err)
                        })

                }
               /* else {
                    socket.broadcast.emit("shopBillNotFound", { "idBill": idBill, "emailShop": emailShop })
                }*/
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
        socket.on("shipperRegister", function (idBill, emailShipper, nameShipper, image, phoneShipper, time) {
            //  console.log(idBill)
            bill.findById(idBill, function (err, data) {
                if (data != null) {
                    if (data.status == 1) {
                        var newNoti = {
                            myEmail: data.emailShop,
                            nameActor: nameShipper,
                            emailActor: emailShipper,
                            content: " Shipper đăng ký ",
                            idBill: idBill,
                            isRead: false,
                            status: 3,
                            time: time
                        };
                        user.findOneAndUpdate({ email: data.emailShop }, { $push: { listNoti: newNoti } }, { safe: true, upsert: true, new: true },
                            function (err, result) {
                                //  console.log("create Noti", data)
                            })
                        var newShipper = {
                            avatar: image,
                            name: nameShipper,
                            email: emailShipper,
                            phone: phoneShipper
                        };
                        bill.findOneAndUpdate({ _id: idBill }, { $push: { listRegisterShippers: newShipper } }, { safe: true, upsert: true, new: true },
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
                            content: " Bạn bị từ chối giao hàng",
                            idBill: idBill,
                            isRead: false,
                            status: 4,
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
                        content: " Bạn bị từ chối giao hàng ",
                        idBill: idBill,
                        isRead: false,
                        status: 4,
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
        socket.on("shopAcceptShipper", function (idBill, time, emailShipper, emailShop, nameShop) {
            console.log("shopAcceptShipper", emailShipper)
            bill.findById(idBill, function (err, data) {
                if (data != null) {
                    user.findOne({ email: emailShipper }, function (err, userShipper) {
                        if (err == null) {

                            var newNoti = {
                                myEmail: emailShipper,
                                nameActor: nameShop,
                                emailActor: data.emailShop,
                                content: "Bạn được nhận giao hàng",
                                idBill: idBill,
                                isRead: false,
                                status: 4,
                                time: time
                            };
                            user.findOneAndUpdate({ email: emailShipper }, { $push: { listNoti: newNoti } }, { safe: true, upsert: true, new: true },
                                function (err, data) {
                                    //console.log("create Noti", data)
                                })
                            data.listRegisterShippers.forEach(function (elementShipper) {
                                if (elementShipper.emailShipper != emailShipper) {
                                    var newNoti = {
                                        myEmail: elementShipper.emailShipper,
                                        nameActor: nameShop,
                                        emailActor: data.emailShop,
                                        content: "Bạn bị từ chối giao hàng",
                                        idBill: idBill,
                                        isRead: false,
                                        status: 4,
                                        time: time
                                    };
                                    user.findOneAndUpdate({ email: elementShipper.emailShipper }, { $push: { listNoti: newNoti } }, { safe: true, upsert: true, new: true },
                                        function (err, data) {
                                            //console.log("create Noti", data)
                                        })
                                }
                            })
                            if (data.methodTransform == 0) {
                                bill.update({ _id: idBill }, { $set: { "status": 3, emailShipper: emailShipper, phoneShipper: userShipper.phone } }, function (err, result) {
                                    if (result != null) {
                                        console.log("info Bill", data)
                                        var newNoti = {
                                            myEmail: data.emailCustomer,
                                            nameActor: nameShop,
                                            emailActor: data.emailShop,
                                            content: "Đơn hàng đang được chuyển",
                                            idBill: idBill,
                                            isRead: false,
                                            status: 6,
                                            time: time
                                        };
                                        user.findOneAndUpdate({ email: data.emailCustomer }, { $push: { listNoti: newNoti } }, { safe: true, upsert: true, new: true },
                                            function (err, data) {
                                                //console.log("create Noti", data)
                                            })
                                        socket.broadcast.emit("customerNoti", { "emailCustomer": data.emailCustomer })
                                        socket.broadcast.emit("shipperShopAcceptYou", { "idBill": idBill, "status": 1, "emailShop": emailShop, "emailShipper": emailShipper })
                                    }
                                })
                            } else {
                                bill.update({ _id: idBill }, { $set: { "status": 2, emailShipper: emailShipper, phoneShipper: userShipper.phone } }, function (err, result) {
                                    if (result != null) {
                                        console.log("info Bill", data)
                                        var newNoti = {
                                            myEmail: data.emailCustomer,
                                            nameActor: nameShop,
                                            emailActor: data.emailShop,
                                            content: "Đơn hàng chờ vận chuyển",
                                            idBill: idBill,
                                            isRead: false,
                                            status: 6,
                                            time: time
                                        };
                                        user.findOneAndUpdate({ email: data.emailCustomer }, { $push: { listNoti: newNoti } }, { safe: true, upsert: true, new: true },
                                            function (err, data) {
                                                //console.log("create Noti", data)
                                            })
                                        socket.broadcast.emit("customerNoti", { "emailCustomer": data.emailCustomer })
                                        socket.broadcast.emit("shipperShopAcceptYou", { "idBill": idBill, "status": 1, "emailShop": emailShop, "emailShipper": emailShipper })
                                    }
                                })
                            }

                        }
                    })
                    bill.update({ _id: idBill },
                        { $pull: { "listRegisterShippers": {} } },
                        function (err, result) {
                            console.log('delets shipper register', result)
                        })

                } else {
                    socket.broadcast.emit("shopBillNotFound", { "idBill": idBill, "emailShop": emailShop })
                }
            })

        })


        // location shipper change (currentUser.getEmail(), location.getLongitude(),location.getLatitude())
        socket.on("shipperChangLocation", function ( emailShipper, longitude, latitude) {
            console.log("shipperChangLocation", emailShipper)
            user.update({ email: emailShipper }, { $set: { "longitude": longitude, "latitude": latitude} }, function (err, result) {
                console.log("shipper location chảng", result)
                socket.broadcast.emit("shopShipperLocation", { "idBill": idBill, "longitude" : longitude, "latitude" : latitude })
            })

        })

         // shop accept shipper 
        socket.on("shopBillShipping", function (idBill, time, emailShipper, emailShop, nameShop) {
            console.log("shopBillShipping", emailShipper)
            bill.findById(idBill, function (err, data) {
                if (data != null) {
                    bill.update({ _id: idBill }, { $set: { "status": 3, emailShipper: emailShipper, phoneShipper: userShipper.phone } }, function (err, result) {
                        if (result != null) {
                            // console.log("info Bill", data)
                            var newNoti = {
                                myEmail: data.emailCustomer,
                                nameActor: nameShop,
                                emailActor: data.emailShop,
                                content: "Đơn hàng đang được chuyển",
                                idBill: idBill,
                                isRead: false,
                                status: 6,
                                time: time
                            };
                            user.findOneAndUpdate({ email: data.emailCustomer }, { $push: { listNoti: newNoti } }, { safe: true, upsert: true, new: true },
                                function (err, data) {
                                    //console.log("create Noti", data)
                                })
                            socket.broadcast.emit("customerNoti", { "emailCustomer": data.emailCustomer })
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
                console.log("cbuy", element.listProduct)
                user.findOne({ email: element.email }, function (err, result) {
                    // console.log("find a user", result)
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
                            listProducts: element.listProduct,
                            moneyItem: 300000,
                            moneyShip: 20000,
                            time: '',
                            note: "String",
                            methodTransform: methodTransform
                        }
                        bill.create(newBill, function (err, result) {
                            if (err == null) {
                                //console.log("find product","goto")
                                // trừ số lượng sản phầm còn trong kho hàng cua shop
                                element.listProduct.forEach(function (elementITem) {
                                    // console.log("find product",elementITem)
                                    product.findById(elementITem.idProduct, function (err, result) {
                                        // console.log("result product",result)
                                        if (result != null) {
                                            //  console.log("create Noti", parseInt(result.quantity, 10) - elementITem.numBuy)
                                            if (parseInt(result.quantity, 10) >= elementITem.numBuy) {
                                                product.findOneAndUpdate({ _id: elementITem.idProduct }, { $set: { quantity: parseInt(result.quantity, 10) - elementITem.numBuy } }, { safe: true, upsert: true, new: true },
                                                    function (err, data) {
                                                        //console.log("create Noti", parseInt(result.quantity, 10) - elementITem.numBuy)
                                                    })
                                            } else {
                                                product.findOneAndUpdate({ _id: elementITem.idProduct }, { $set: { quantity: 0 } }, { safe: true, upsert: true, new: true },
                                                    function (err, data) {
                                                        //console.log("create Noti", parseInt(result.quantity, 10) - elementITem.numBuy)
                                                    })
                                            }

                                        }
                                    })
                                })
                                // console.log("create Bill", result)
                                var newNoti = {
                                    myEmail: result.emailShop,
                                    nameActor: userCustomer.name,
                                    emailActor: userCustomer.email,
                                    content: "Mua hàng",
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