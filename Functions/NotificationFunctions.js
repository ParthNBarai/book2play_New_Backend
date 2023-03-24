const NotificationSchema = require('../schemas/NotificationSchema')
const OwnerNotificationSchema = require('../schemas/OwnerNotificationSchema')
const venueSchema = require('../schemas/VenueSchema')
const userSchema = require('../schemas/UserSchema')
const pushNotificationService = require('../Notifications/push-notification.services')
const pushNotificationServiceOwner = require('../Notifications/push-notifications_owner')
const BookRequestSchema = require('../schemas/BookRequestSchema')
require("dotenv/config");



async function SendNotificationToDevice(req, res, next) {
    // console.log(req.user[0].device_id);
    // const deviceid = req.user[0].device_id;

    console.log("Here in noti functions");

    
    const user = await BookRequestSchema.findById(req.body.id)
    console.log(user)
    const user_device = await userSchema.findOne({ phone: user.phone })
    let date = user.date
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let amount = parseInt(user.price)
    let price = amount / 4;
    let noti_msg
    // console.log(amount)
    // console.log(price)
    // console.log(amount-price)
    // console.log(day + "-" + month + "-" +year)

    if (req.params.result === "rejected") {
        noti_msg  = "Hello " + user.username + ", we have confirmed your booking(s) for '" +
        user.venueName + "' turf on " +
        day + "-" + month + "-" + year + " at slot(s) " + user.time +
        ". You will receive your refund within 5-7 business days! Thank You " +
        ".\nThank you,\nTeam Book2Play."
    }

    else{
        noti_msg  = "Hello " + user.username + ", we have confirmed your booking(s) for '" +
        user.venueName + "' turf on " +
        day + "-" + month + "-" + year + " at slot(s) " + user.time +
        ". The balance amount will be Rs. " + (amount - price) +
        ".\nThank you,\nTeam Book2Play."
    }

    var message = {
        app_id: process.env.ONE_SIGNAL_APP_ID,
        contents: {
            en: noti_msg
        },

        included_segments: ["included_player_ids"],
        include_player_ids: [user.device_id],
        content_available: true,
        small_icon: "ic_notification_icon",
        data: {
            PushTitle: "Booking Accepted!!"
        },
    };
    // console.log(typeof(message.contents))
    const notification = new NotificationSchema({
        device_id: user_device.device_id,
        phone: user.phone,
        contents: message.contents,
        date: new Date()
    })
    const saved = await notification.save();
    console.log(notification)
    console.log(saved)
    pushNotificationService.SendNotification(message, (error, results) => {
        if (error) {
            return next(error);
        }
        // return res.status(200).send({
        //     message: "Success",
        //     data: results,
        // });
        console.log({
            message: "Success",
            data: results,
        })

    })

};

async function SendNotificationToOwnerDevice(req, res, next) {
    // console.log(req.user[0].device_id);
    // const deviceid = req.user[0].device_id;

    let date = new Date(req.body.bookRequest[0].date)
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    const owner = await venueSchema.findOne({ $and: [{ email: req.body.email }, { name: req.body.name }] });

    var message = {
        app_id: process.env.ONE_SIGNAL_Owner_App_ID,
        contents: {
            en: "Hello " + req.body.name + ", you have requests for booking(s) for turf on " +
                day + "-" + month + "-" + year + " at slot(s) " + req.body.bookRequest[0].time +
                ".\nThank you,\nTeam Book2Play."
        },

        included_segments: ["included_player_ids"],
        include_player_ids: [owner.device_id],
        content_available: true,
        small_icon: "ic_notification_icon",
        data: {
            PushTitle: "Booking Accepted!!"
        },
    };

    const notification = new OwnerNotificationSchema({
        device_id: owner.device_id,
        phone: owner.phone[0],
        contents: message.contents,
        date: new Date()
    })
    const saved = await notification.save();
    // console.log(notification)
    // console.log(saved)
    pushNotificationServiceOwner.SendNotification(message, (error, results) => {
        if (error) {
            console.log(error)
            return next(error);
        }
        // return res.status(200).send({
        //     message: "Success",
        //     data: results,
        // });
        console.log({
            message: "Success",
            data: results
        })

    });

};

module.exports = { SendNotificationToDevice, SendNotificationToOwnerDevice }