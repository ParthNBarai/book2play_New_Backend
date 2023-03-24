const express = require('express')
const router = express.Router();
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser')
const NotificationSchema = require('../schemas/NotificationSchema')
const pushNotificationService = require('../Notifications/push-notification.services')
require("dotenv/config");


//Route for public notifications : /api/v1/public/sendnotification
router.get("/sendnotification", (req, res) => {
  try {
    var message = {
      app_id: process.env.ONE_SIGNAL_APP_ID,
      contents: { en: "This is public Notification" },
      included_segments: ["All"],
      content_available: true,
      small_icon: "ic_notification_icon",
      data: {
        PushTitle: "CUSTOM NOTIFICATION"
      },
    };
    pushNotificationService.SendNotification(message, (error, results) => {
      if (error) {
        return next(error);
      }
      return res.status(200).send({
        message: "Success",
        data: results,
      });

    });
  }
  catch (err) {
    console.log(err.message)
    res.status(500).json(err.message);
  }
})

module.exports = router