const express = require('express')
const router = express.Router();
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser')
const bookFunctions = require('../Functions/BookingFunctions')
const NotifcationFunctions = require('../Functions/NotificationFunctions')
require("dotenv/config");


//Route for request for booking : /api/v1/booking/bookRequest
router.post("/bookRequest", async (req, res) => {
    try {

        await bookFunctions.bookingRequest(req, res);
        await NotifcationFunctions.SendNotificationToOwnerDevice(req, res);
    } catch (err) {
        console.log(err.message)
        res.status(500).json(err.message)
    }
})


// Route for booking : /api/v1/booking/accepted || /api/v1/booking/rejected
router.post('/:result', async (req, res) => {
    try {
        if (req.params.result === "accepted") {
            await bookFunctions.book(req, res);
            await bookFunctions.userPointUpdates(req, res);
            await NotifcationFunctions.SendNotificationToDevice(req, res);
            await bookFunctions.bookRequestDelete(req, res);
            res.status(200).send("The booking has been accepted successfully!")
        }
        else if (req.params.result === "rejected") {
            await NotifcationFunctions.SendNotificationToDevice(req, res);
            res.status(200).send("The booking has been cancelled")
        }
    } catch (err) {
        console.log(err.message)
        res.status(500).json(err.message)
    }

})

router.post("/bookRequest/delete", async (req, res) => {
    try {
        await bookFunctions.book(req, res);
        await bookFunctions.bookRequestDelete(req, res);
    } catch (err) {
        console.log(err.message)
        res.status(500).json(err.message)
    }

})

module.exports = router
