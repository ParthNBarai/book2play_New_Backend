const express = require('express')
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { validateWebhookSignature } = require('razorpay/dist/utils/razorpay-utils')
const paymentSchema = require('../schemas/PaymentSchema')
require("dotenv/config");
const Razorpay = require("razorpay");
const instance = new Razorpay({
    key_id: process.env.KEY_ID,
    key_secret: process.env.KEY_SECRET,
});

//Route for webhooks : /api/v1/razorpay/webhooks
router.post('/webhooks', async (req, res) => {
    try {
        // # NODE SDK: https://github.com/razorpay/razorpay-node */
        validateWebhookSignature(JSON.stringify(req.body), req.headers['x-razorpay-signature'], process.env.WebHook_Secret)



        // console.log(req.body)
        res.status(200).json("OK");



        const newPayment = new paymentSchema({

            payment_id: req.body.payload.payment.entity.id,
            order_id: req.body.payload.payment.entity.order_id,
            amount: req.body.payload.payment.entity.amount,
            payment_method: req.body.payload.payment.entity.method,
            contact: req.body.payload.payment.entity.contact,
            status: req.body.payload.payment.entity.status,
        })

        const saved = await newPayment.save();
        // console.log(saved);
        // console.log("Payment saved!");

    } catch (err) {

        console.log("Razorpay file payment add func");
        console.log(err);
    }
})

//Route for generating order id : /api/v1/razorpay/create/orderId
router.post("/create/orderId", (req, res) => {
    // console.log("Hii")
    // console.log("Hii" + req.body);
    var options = {
        amount: req.body.amount,  // amount in the smallest currency unit
        currency: "INR",
        receipt: "rcp1"
    };
    instance.orders.create(options, function (err, order) {
        // console.log(order.id);
        res.send({ orderId: order.id });
    });
})

module.exports = router