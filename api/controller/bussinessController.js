var user = require("../model/user");
var bill = require("../model/bill")
var product = require("../model/product")

module.exports = function (app, passport, io) {



    //================ Product ========================================
    // create Product:
    app.post("/shop/createProduct", function (req, res) {
        console.log(req.body)
        product.create(req.body, function (err, result) {
            if (!err)
                res.json({ "status": true })
            else
                //res.json({ "status": false })
                console.log(err)
        })
    })

    // get My product: 
    app.get("/shop/getProduct/:email", function (req, res) {
        product.find({ emailShop: req.params.email }, function (err, result) {
            res.json({ "arrProduct": result });
        })
    })

    // get all product:
    app.get("/shop/getAllProduct", function (req, res) {
        product.find(function (err, result) {
            if (err)
                res.send(err)
            else
                res.json({ "arrAllProduct": result });
        })
    })

     // get Product by _id: 
     app.get("/user/getProductById/:id", function (req, res) {
        product.findById( req.params.id,function (err, result) {
            if (err)
                res.json({ "status": false })
            else
                res.json({ "product": result });
        })
    })

    // Update quantity product: 
    app.post("/shop/updateNumPro", function (req, res) {
        product.update({ id: req.body.id },
            {
                $set: {
                    "quantity": req.body.quantity
                }
            }, function (err, result) {
                if (err == null)
                    res.json({ "status": true })
            })
    })


    // Update Product : 
    app.post("/shop/updateProduct", function (req, res) {
        product.update({ id: req.body.id },
            {
                $set: {
                    "name": req.body.name,
                    "price": req.body.price,
                    "weight": req.body.weight,
                    "detail": req.body.detail,
                    "color": req.body.color,
                    "kind": req.body.kind,
                    "guarantee": req.body.guarantee
                }
            }, function (err, result) {
                if (err == null)
                    res.json({ "status": true })
            })
    })


    // Delete Product:
    app.get("/shop/deleteProduct/:id", function (req, res) {
        product.remove({ "id": req.params.id }, function (err, result) {
            if (err != null) {
                res.json({ "status": true })
            }
        })
    })

    // =================================================================

    //============================Bill==================================
    // create Bill:
    app.post("/customer/createBill", function (req, res) {
        bill.create(req.body, function (err, result) {
            if (!err) {
                res.json({ "status": true });
                socket.io.emit('haveNewBill', { 'bill': req.body })
            }
        })
    })

    // get My Bill: 
    app.get("/user/getBill/:email", function (req, res) {
        bill.find({ email: req.params.email }, function (err, result) {
            res.json({ "arrBill": result });
            console.log(result);
        })
    })

    // get All Bill:
    app.get("/shop/getAllProduct", function (req, res) {
        product.find(function (err, result) {
            if (err)
                res.send(err)
            else
                res.json({ "arrAllProduct": result });
        })
    })

    // Update Bill : 
    app.post("/shop/updateBill", function (req, res) {
        bill.update({ id: req.body.id },
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
        bill.find({ emailShop: { $regex: "^" + req.params.email } }, {status : {$regex: "^" + 0}},function (err, result) {
            res.json({ "arrBill": result });
        })
    })
    //================================================

    // Delete Bill:
    app.get("/shop/deleteBill/:id", function (req, res) {
        bill.remove({ "id": req.params.id }, function (err, result) {
            if (err != null) {
                res.json({ "status": true })
            }
        })
    })


}
//==================================================================================