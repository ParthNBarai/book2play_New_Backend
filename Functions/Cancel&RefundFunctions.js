const mongoose = require("mongoose");
const cancelledBookSchema = require('../schemas/CancelBook')
const RefundSchema = require('../schemas/RefundSchema')
const bookSchema = require('../schemas/BookingSchema')
const userSchema = require('../schemas/UserSchema')
const venueSchema = require('../schemas/VenueSchema')
const Razorpay = require("razorpay");
const pushNotificationServiceOwner = require('../Notifications/push-notifications_owner')
const BookingSchema = require("../schemas/BookingSchema");
const BookRequestSchema = require("../schemas/BookRequestSchema");
const NotificationSchema = require("../schemas/NotificationSchema");
require("dotenv/config");
const instance = new Razorpay({
    key_id: process.env.KEY_ID,
    key_secret: process.env.KEY_SECRET,
});

async function cancelledBookings(req, res) {
    
        if (req.body.status === "confirmed") {
            const findBooking = await BookingSchema.findById(req.body.id)

            console.log("confirmed")
            console.log(findBooking)
            console.log("confirmed")

            const cancelBook = new cancelledBookSchema({
                "venueemail": findBooking.owneremail,
                "venueName": findBooking.ownername,
                "turfNo": findBooking.turfNo,
                "date": new Date(findBooking.date),
                "time": findBooking.time,
                "price": findBooking.price,
                "paymentId": findBooking.paymentId,
                "orderId": findBooking.orderId,
                "signature": findBooking.signature,
                "status": req.body.status,
                "phone": findBooking.phone,
                "name": findBooking.username
            })

            const save = await cancelBook.save()
            console.log(save)

        }
        else if (req.body.status === "pending") {
            const findBooking = await BookRequestSchema.findById(req.body.id)
            console.log("findBooking")
            console.log(findBooking)
            console.log("findBooking")
            const cancelBook = new cancelledBookSchema({
                "venueemail": findBooking.venueemail,
                "venueName": findBooking.venueName,
                "turfNo": findBooking.turfNo,
                "date": new Date(findBooking.date),
                "time": findBooking.time,
                "price": findBooking.price,
                "paymentId": findBooking.paymentId,
                "orderId": findBooking.orderId,
                "signature": findBooking.signature,
                "status": req.body.status,
                "phone": findBooking.phone,
                "name": findBooking.username
            })

            const save = await cancelBook.save()
            console.log(save)
        }
    
}

async function refunds(req, res) {
  
        console.log("Here in refund")
        // console.log(req.params.id)
        const user = await BookingSchema.findById(req.body.id) || await BookRequestSchema.findById(req.body.id)
        // console.log(user.turfNo)
        const paymentId = user.paymentId
        let amount = user.price
        amount = amount / 4;
        amount = amount * 100;

        const status = await instance.payments.refund(paymentId, {
            "amount": amount,
            "speed": "optimum",
            "receipt": paymentId
        })
        console.log(status)

        const newRefunds = new RefundSchema({
            refundId: status.id,
            amount: status.amount,
            paymentId: status.payment_id,
            createdAt: status.created_at,
            status: status.status,
            speed_processed: status.speed_processed,
            speed_requested: status.speed_requested,
            phone: user.phone,
            name: user.username
        })

        console.log(newRefunds)
        const saved = await newRefunds.save();

        console.log(saved);
   
}

async function cancelSlot(req, res) {
   
        console.log("Here in cancel slot ")

        const confirmBooking = await BookingSchema.findById(req.body.id)
        console.log(confirmBooking)
        const deleteRequest = await BookingSchema.deleteOne({
            "_id": mongoose.Types.ObjectId(req.body.id)
        })

        console.log("cancelSlot")
        console.log(deleteRequest)
        console.log("cancelSlot")

        let date = new Date(confirmBooking.date)
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        const owner = await venueSchema.findOne({ $and: [{ email: confirmBooking.owneremail }, { name: confirmBooking.ownername }] });

        var message = {
            app_id: process.env.ONE_SIGNAL_Owner_App_ID,
            contents: {
                en: "Booking Canceled! \n Hello " + confirmBooking.ownername + ", booking(s) for turf on " +
                    day + "-" + month + "-" + year + " at slot(s) " + confirmBooking.time +
                    " has been cancelled by user " + confirmBooking.username + ".\nThank you,\nTeam Book2Play."
            },

            included_segments: ["included_player_ids"],
            include_player_ids: [owner.device_id],
            content_available: true,
            small_icon: "ic_notification_icon",
            data: {
                PushTitle: "Booking Accepted!!"
            },
        };
        const notification = new NotificationSchema({
            device_id: user_device.device_id,
            phone: user.phone,
            contents: message.contents,
            date: new Date()
        })
        const saved = await notification.save();
        pushNotificationServiceOwner.SendNotification(message, (error, results) => {
            if (error) {
                console.log(error)
                return next(error);
            }

            console.log({
                message: "Success",
                data: results
            })

        });
        // console.log(deleted)


}

async function cancelPendingSlot(req, res) {
    
        console.log("Here in cancel pending slot ")
        const deleteRequest = await BookRequestSchema.deleteOne({
            "_id": mongoose.Types.ObjectId(req.body.id)
        })
        console.log("deleteRequest")
        console.log(deleteRequest)
        console.log("deleteRequest")


}


module.exports = { cancelledBookings, refunds, cancelSlot, cancelPendingSlot }