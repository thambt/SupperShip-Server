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

         socket.on("shopAcceptBill", function (code,idBill) {
             console.log(idBill)
             bill.findById(idBill, function(err, data)
             {
                 if(err==null){
                     if(code== 1)
                     console.log(data)
                     if(data != null)
                     {
                         
                         socket.broadcast.emit("shopAcceptYourBill",{"code": code})
                        // socket.emit("shopAcceptYourBill",code)
                 }
                     // socket.broadcast.emit("shopAcceptYourBill",data.emailCustomer, idBill,code)
                 }
             })
         })


        socket.on("cBuy", function (arrProduct, userCustomer, time) {
            console.log(time)
            Array.from(arrProduct).forEach(function (element) {
               user.findOne({ email: element.email }, function (err, result) {
                    console.log("find a user",result)
                    if(err == null){
                    var newBill = {
                        emailShop: element.email,
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
                            console.log("create Bill",result)
                            var newNoti = {
                                emailShop: result.emailShop,
                                nameActor: userCustomer.email,
                                action: "mua hang",
                                idBill: result._id,
                                read: false,
                                status: 0,
                                time: time
                            };
                             user.findOneAndUpdate({ email: result.emailShop }, { $push: { listNoti: newNoti } }, { safe: true, upsert: true, new: true },
                                    function (err, data) {
                                console.log("create Noti",data)
                            })
                                   socket.broadcast.emit("SopNewBill", { "emailCustom": userCustomer.email, "phoneCustomer": userCustomer.phone, "emailShop":element.email, "idBill": result._id, "action": " mua hang " })
                        }
                    })
               }
                })
               
            })
        })
    })
}