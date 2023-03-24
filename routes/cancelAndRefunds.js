const express = require('express')
const router = express.Router();
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser')
const cancelledBookSchema = require('../schemas/CancelBook')
const CancelFunctions = require('../Functions/Cancel&RefundFunctions')
require("dotenv/config");


//Route for payments refund : /api/v1/payments/:id/refund
router.post('/payments/:id/refund', async (req, res) => {
    try {

        await CancelFunctions.cancelledBookings(req, res);
        await CancelFunctions.refunds(req, res);
        if (req.body.status === "confirmed") {
            await CancelFunctions.cancelSlot(req, res);
        }
        else if (req.body.status === "pending") {
            await CancelFunctions.cancelPendingSlot(req, res);
        }


        res.status(200).json({ message: "Booking cancelled successfully! You will receive your refund within 5-7 business days! Thank You " })
    } catch (err) {
        const error = {
            "error in api": err.message,
            "error from razorpay": err.description
        }
        console.log(err)

        res.status(500).json("Something went wrong booking not cancelled")
    }
})

//Route for fetching cancelled bookings : /api/v1/cancelBook/fetch
router.post('/cancelBook/fetch', fetchuser, async (req, res) => {
    try {
        const cancelledBookings = await cancelledBookSchema.find({ phone: req.user.phone })
        res.status(200).json(cancelledBookings)
    } catch (err) {
        console.log(err.message)
        res.status(500).json(err.message)
    }
})

module.exports = router