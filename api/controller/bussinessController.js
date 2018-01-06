var user = require("../model/user");
var bill = require("../model/bill")
var product = require("../model/product")
 

module.exports = function (app, passport, io) {

    //================ Product ========================================
    // create Product:
        // console.log(req.body)
        app.post("/shop/createProduct", function (req, res) {
        // console.log(req.body)
        product.create(req.body, function (err, result) {
            if (err == null)
                res.json({ "status": true })
            else
                res.json({ "status": false })
            // console.log(err)
        })
    })

    // get My product: 
    app.get("/shop/getProduct/:email", function (req, res) {
        product.find({ emailShop: req.params.email }, function (err, result) {
            if (err == null)
                res.json({ "arrProduct": result });
            else
                res.json({ "arrProduct": null, "status": false });
        })
    })

    // get all product:
    app.get("/shop/getAllProduct", function (req, res) {
        product.find(function (err, result) {
            if (err)
                res.json({ "arrAllProduct": null, "status": false });
            else
                res.json({ "arrAllProduct": result });
        })
    })

    // get Product by _id: 
    app.get("/user/getProductById/:id", function (req, res) {
        product.findById(req.params.id, function (err, result) {
            if (err)
                res.json({ "status": false, "product": null })
            else
                res.json({ "product": result });
        })
    })

    // Update quantity product: 
    app.post("/shop/updateNumPro", function (req, res) {
        product.update({ _id: req.body._id },
            {
                $set: {
                    quantity: req.body.quantity
                }
            }, function (err, result) {
                if (err == null)
                    res.json({ "status": true })
                else
                    res.json({ "status": false })
            })
    })


    // Update Product : 
    app.post("/shop/updateProduct", function (req, res) {
        //console.log()
        product.update({ _id: req.body._id },
            {
                $set: {
                    image: req.body.image,
                    name: req.body.name,
                    price: req.body.price,
                    weight: req.body.weight,
                    quantity: req.body.quantity,
                    category: req.body.category,
                    detail: req.body.detail,
                    kind: req.body.kind,
                    guarantee: req.body.guarantee
                }
            }, function (err, result) {
                //  console.log(result)
                if (err == null)
                    res.json({ "status": true })
                else
                    res.json({ "status": false }) // mayby product not found.
            })
    })


    // get Product theo loai cho khach
    app.get("/shop/filterProduct/:kind", function (req, res) {
        product.find({ kind: { $regex: "^" + req.params.kind } }, function (err, result) {
            res.json({ "arrProduct": result });
        })
    })

    // get Product theo loai cho shop
    app.get("/shop/shopFilterProduct/:kind/:email", function (req, res) {
        product.find({ emailShop: req.params.email, kind: { $regex: "^" + req.params.kind } }, function (err, result) {
            res.json({ "arrProduct": result });
        })
    })

    //get product by idBill
    app.get("/bussiness/getListProductByBill/:idBill", function (req, res) {
        bill.findById(req.params.idBill,function(err, result){
            console.log(result)
            if(result != null){
                var listProduct = new Array();
                 Array.from(result.listProducts).forEach(function (element) {
                   listProduct.push(element.idProduct)
                 })
                 if(listProduct.length > 0){
                     product.find({_id: { $in: listProduct }}, function(err, result){
                         if(result != null)
                         res.json({"status": true, "arrProduct": result });
                     })
                 }
            } else{
                 res.json({ "status": false })
            }
        })
    })

    /**/


    // Delete Product:
    app.get("/shop/deleteProduct/:id", function (req, res) {
        product.remove({ _id: req.params.id }, function (err, result) {
            if (err == null) {
                res.json({ "status": true })
            }
            else
                res.json({ "status": false })
        })
    })

    // =================================================================

    //============================Bill==================================
    // create Bill:
    app.post("/customer/createBill", function (req, res) {
        bill.create(req.body, function (err, result) {
            if (!err) {
                res.json({ "status": true });
            }
        })
    })

    // get Shop Bill: 
    app.get("/user/getBill/:email", function (req, res) {
        console.log(req)
        bill.find({ emailShop: req.params.email , status: {$gte: 0}}, function (err, result) {
            res.json({ "arrBill": result });
            // console.log(result);
        })
    })

    //get Custom bill
    app.get("/custom/getBill/:email", function (req, res) {
        bill.find({ emailCustomer: req.params.email, status: {$gte: 0} }, function (err, result) {
            res.json({ "arrBill": result });
            //console.log(result);
        })
    })

    //get Bill by Id: 
    app.get("/user/getBillById/:id", function (req, res) {
        bill.findById(req.params.id, function (err, result) {
            res.json({ "Bill": result });
          
        //  console.log(result);
        })
    })

    // get All Bill:
    app.get("/shipper/getAllBill", function (req, res) {
        bill.find({status: 1},function (err, result) {
            //console.log(result)
            if (err)
                res.json({ "arrBill": result });
            else
                res.json({ "arrBill": result });
        })
    })

    // get Shipper Register my bill:
    app.get("/shipper/getshipperRegister/:id/:myEmail", function (req, res) {
        bill.findById(req.params.id, function (err, result) {
            // console.log(result)
            if (result != null) {
                //  if(result)
                res.json({ "arrShipper": result.listRegisterShippers });
            }
            else
                res.json({ "arrShipper": result.listRegisterShippers });
        })
    })


    // Update Bill : 
    app.post("/shop/updateBill", function (req, res) {
        bill.update({ _id: req.body.id },
            {
                $set: {
                    "emailShipper": req.body.emailShipper,
                    "phoneSend": req.body.phoneSend,
                    "phoneReceive": req.body.phoneReceive,
                    "phoneShipper": req.body.phoneShipper,
                    "addressReceive": req.body.addressReceive,
                    "addressSend": req.body.addressSend,
                    "status": req.body.status,
                    "Category": req.body.Category,
                    "weight": req.body.weight,
                    "idProduct": req.body.idProduct,
                    "moneyItem": req.body.moneyItem,
                    "moneyShip": req.body.moneyShip,
                    "time": req.body.time,
                    "note": req.body.note
                }
            }, function (err, result) {
                if (err == null)
                    res.json({ "status": true })
            })
    })


    //============= get temp bill for shop============
    app.get("/shop/getBillTemp/:email", function (req, res) {
        
        bill.find({ emailShop: { $regex: "^" + req.params.email } }, { status: 0 }, function (err, result) {
            res.json({ "arrBill": result });
        })
    })
    //================================================

    //============= get bill available for shipper============
    app.get("/shipper/getBillAvai", function (req, res) {
        bill.find({ status: 1 }, function (err, result) {
            res.json({ "arrBill": result });
            //   console.log(err)
        })
    })

    // Delete Bill:
    app.get("/shop/deleteBill/:id", function (req, res) {
        bill.remove({ _id: req.params.id }, function (err, result) {
            // console.log(err)
            if (err == null) {
                res.json({ "status": true })
            }
            else {
                res.json({ "status": false })
            }

        })
    })

    // cập nhật trang tahis Bill gần tới
    app.get("/customer/billNearCustomer/:id", function (req, res) {
        console.log("neame", req.params.id)
        bill.findOneAndUpdate({ _id: req.params.id }, { $set: { status: 4 } }, { safe: true, upsert: true, new: true },
            function (err, data) {
                // console.log("neame", err)
                if (err == null) {
                    res.json({ "status": true })
                }
                else {
                    res.json({ "status": false })
                }
              //  console.log("create Noti")
            })
    })

    // shipper get my bill
    app.get("/shipper/getMyBill/:emailShipper", function (req, res) {
       // console.log("neame", req.params.id)
        bill.find({ status: 2, emailShipper: req.params.emailShipper },
            function (err, result) {
                if (result != null) {
                res.json({ "status": true, "arrBill": result })
                console.log("get getMyBillShipping", result)
            }
            else {
                res.json({ "status": false })
            }
            })
    })

    // shop get my bill wait to ship
    app.get("/shop/getBillWait/:emailShop", function (req, res) {
       // console.log("neame", req.params.id)
        bill.find({ status: 2, emailShop: req.params.emailShop },
            function (err, result) {
                if (result != null) {
                res.json({ "status": true, "arrBill": result })
              //  console.log("get getMyBillShipping", result)
            }
            else {
                res.json({ "status": false })
            }
            })
    })

    //====================================================================

    //============================Noti==================================

    // get My Noti: 
    app.get("/user/getNoti/:email", function (req, res) {
        var myNoti = new Array();
        user.findOne({ email: req.params.email }, function (err, result) {
            if (result != null) {
                //   console.log(result)
                Array.from(result.listNoti).forEach(function (element) {
                    myNoti.push(element)
                })
            }
            res.json({ "listNoti": myNoti })
            // console.log(myNoti)
        })
    })

    //================================================

    // Delete Noti:
    app.get("/user/deleteNoti/:email/:id", function (req, res) {
        user.update({ email: req.params.email },
            { $pull: { "listNoti": { _id: req.params.id } } },
            function (err, result) {
                if (err == null) {
                    res.json({ "status": true });
                }
                else {
                    res.json({ "status": false });
                }
            })
    })

    // update read of Noti
    app.get("/user/updateReadNoti/:email/:id/:status", function (req, res) {
        user.update({ email: req.params.email, "listNoti._id": req.params.id }, { $set: { "listNoti.$.read": req.params.status } }, function (err, result) {
            if (err == null)
                res.json({ "status": true })
            else
                res.json({ "status": false })
        })
    })


    // update status of Noti
    app.get("/user/updateStatusNoti/:email/:id/:status/:idBill", function (req, res) {
        //  console.log('status', req.params.status)
        user.update({ email: req.params.email, "listNoti._id": req.params.id }, { $set: { "listNoti.$.status": req.params.status } }, function (err, result) {
            if (err == null) {
                if (req.params.status == 2) {
                    bill.remove({ _id: req.params.idBill }, function (err, result) {
                        if (err == null) {
                            res.json({ "status": true })
                        }
                        else
                            res.json({ "status": false })
                    })
                }
                else
                    res.json({ "status": true })
            }
            else
                res.json({ "status": false })
        })
    })
    //==================================================================

    // get Shop's Bill Shipping
    app.get("/shop/getMyBillShipping/:email", function (req, res) {
        bill.find({ emailShop: req.params.email, status: { $in : [3,4]} }, function (err, result) {
            if (result != null) {
                res.json({ "status": true, "arrBill": result })
                console.log("get getMyBillShipping", result)
            }
            else {
                res.json({ "status": false })
            }
        })
    })

    // get customer's Bill  shipping
    app.get("/customer/getMyBillShipping/:email", function (req, res) {
        bill.find({ emailCustomer: req.params.email, status: { $in : [3,4]}}, function (err, result) {
            if (result != null) {
                res.json({ "status": true, "arrBill": result })
            }
            else
                res.json({ "status": false })
        })
    })

    // get customer's Bill find ship
    app.get("/customer/getMyBillFindShip/:email", function (req, res) {
        bill.find({ emailCustomer: req.params.email, status: 1 }, function (err, result) {

            if (result != null) {
                // arrBillWaitShip = result            
                res.json({ "status": true, "arrBill": result })
            }
            else
                res.json({ "status": false })
        })
    })

    // get customer's Bill
    app.get("/customer/getMyBillWaiting/:email", function (req, res) {
        bill.find({ emailCustomer: req.params.email, status: 2 }, function (err, result) {

            if (result != null) {
                res.json({ "status": true, "arrBill": result })
            }
            else {
                res.json({ "status": false })
            }
        })
    })

    // get My shipper locationlocation
    app.get("/shop/getMyShipper/:emailShipper", function (req, res) {
        user.findOne({ email: req.params.emailShipper }, function (err, result) {
            console.log(result)
            if (result != null) {

                res.json({ "status": true, "longitude": result.longitude, "latitude": result.latitude, "online": result.isOnline })
            }
            else {
                res.json({ "status": false })
            }
        })
    })

    //get Shipper Near 
    app.get("/shop/getShipperNearMe", function (req, res) {
        // console.log("ooooo")
        user.find({ isOnline: true, kindUser: 2 }, function (err, result) {
          //  console.log(result)
            if (result == null) {

                res.json({ "arrShipperNear": null, "status": false });
            }
            else
                res.json({ "arrShipperNear": result, "status": true });
        })
    })

}
//==================================================================================