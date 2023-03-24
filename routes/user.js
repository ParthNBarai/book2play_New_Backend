const express = require('express')
const router = express.Router();
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser')
const fetchnewuser = require('../middleware/refreshToken')
const multer = require('../middleware/multer')
const userSchema = require('../schemas/UserSchema')
const bookSchema = require('../schemas/BookingSchema')
const venueSchema = require('../schemas/VenueSchema')
const NotificationSchema = require('../schemas/NotificationSchema')
const OwnerNotificationSchema = require('../schemas/OwnerNotificationSchema')
const pushNotificationService = require('../Notifications/push-notification.services')
const pushNotificationServiceOwner = require('../Notifications/push-notifications_owner')
const DraftSchema = require('../schemas/BookingCopy')
const auth = require('../Authentication/GetBearerToken')
const ReferralFunctions = require('../Functions/ReferralFunctions')
const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const { sign, verify } = require("jsonwebtoken");
const { JsonWebTokenError } = require("jsonwebtoken");
const jwt = require("jsonwebtoken");
let referralCodeGenerator = require('referral-code-generator');
// const referral = ReferralFunctions.referral;

require("dotenv/config");


//Route for user signup : /api/v1/user/signup
router.post('/signup', [
    body('name', 'Enter a valid Name').isLength({ min: 3 }),
    body('password', 'Password must be atleast 8 characters').isLength({ min: 8 }),
    body('pincode', 'Enter a valid pincode').isLength({ min: 6, max: 6 }),
    body('phone', 'Enter a valid phone number').isLength({ min: 13, max: 13 })
], multer.upload.single("avatar"), async (req, res) => {
    try {
        const salt = genSaltSync(10);
        req.body.password = hashSync(req.body.password, salt);

        const user = new userSchema({
            // _id : req.body.email,
            // email: req.body.email,
            password: req.body.password,
            name: req.body.name,
            pincode: req.body.pincode,
            phone: req.body.phone,
            user_id: req.body.user_id,
            device_id: req.body.device_id,
            referral: referralCodeGenerator.custom('lowercase', 2, 4, req.body.name),
            points: await ReferralFunctions.referral(req, res),

        });

        const ans = await ReferralFunctions.referral(req, res);
        // console.log("ans " + ans);

        if (ans == false) {
            return res.status(403).json({
                error: {
                    message: "Referral code invalid!!"
                }
            })
        }
        else {
            const saved = await user.save();
            if (saved) {
                user.password = undefined;
                const newUser = {
                    phone: user.phone,
                    name: user.name,
                    device_id: user.device_id
                }
                const refresh = sign({ result: newUser }, process.env.Refresh_token_id)
                const jsontoken = await auth.tokenGenerate(newUser);
                return res.status(200).json({
                    success: 1,
                    message: "Successful signup",
                    token: jsontoken,
                    refreshToken: refresh
                });
            }
            else {


                return res.status(403).json({
                    error: {
                        message: "Username or Password Invalid!"
                    }
                })
            }
        }
    }
    catch (err) {
        console.error(err)
        console.log(err.message)
        res.status(400).json({ message: err.message });
    }


})

//Route for user login : /api/v1/user/login
router.post('/login', [
    body('phone', 'Enter a valid phone number').isLength({ min: 13, max: 13 }),
    body('password', 'Password must be atleast 8 characters').isLength({ min: 8 })
], async (req, res) => {
    try {
        const phoneuser = { phone: req.body.phone };
        userSchema.findOne({ phone: req.body.phone })
            .exec()
            .then(async user => {
                // console.log(user)
                if (user.length < 1) {
                    return res.status(403).json({
                        error: {
                            message: "User Not Found, Kindly Register!"
                        }
                    })
                }

                else {
                    const result = compareSync(req.body.password, user.password);
                    if (result) {
                        user.password = undefined;
                        const newUser = {
                            phone: user.phone,
                            name: user.name,
                            device_id: user.device_id
                        }
                        // console.log(newUser)
                        const jsontoken = await auth.tokenGenerate(newUser);
                        const refresh = sign({ result: newUser }, process.env.Refresh_token_id)
                        // console.log("refresh")
                        // console.log(refresh)
                        const newid = { $set: { device_id: req.body.device_id } };
                        const result1 = await userSchema.updateOne(phoneuser, newid);
                        return res.status(200).json({
                            success: 1,
                            message: "Successful login",
                            token: jsontoken,
                            refreshToken: refresh
                        });
                    }
                    else {
                        // console.log(err.message)
                        return res.status(403).json({
                            error: {
                                message: "Username or Password Invalid!"
                            }
                        })
                    }

                }

            })

    }
    catch (err) {
        console.log(err.message)
        res.status(500).json({ message: err.message });
    }
})

//Route for user autologin : /api/v1/user/autologin
router.post('/autologin', fetchuser, async (req, res) => {
    try {
        const t = await req.user;
        // console.log(req.user[0].booking[0]);
        res.json({
            message: 'Post created',
            s: t
        });
    }
    catch (err) {
        console.log(err.message)
        res.status(500).json(err.message);
    }
})

//Route for fetching turfs on homeScreen : /api/v1/user/homePage/venue
router.post('/homePage/venue', [
    body('email', 'Enter a valid Email').isEmail()
], async (req, res) => {
    try {
        userSchema.findOne({ phone: req.user.phone })
            .exec()
            .then(async user => {
                const userturfHome = await venueSchema.find({ pincode: user[0].pincode });
                res.status(200).json(userturfHome);
            })
    }
    catch (err) {
        console.log(err.message)
        res.status(400).json({ message: err.message });
    }
})


// Route for fetching profile : /api/v1/user/profile
router.post('/profile', fetchuser, async (req, res) => {
    try {
        const t = await req.user;
        // console.log(req.user[0].booking[0]);
        res.json({
            message: 'Post created',
            s: t
        });
    }
    catch (err) {
        console.log(err.message)
        res.status(500).json(err.message);
    }
})

//Route for new tokens : /api/v1/user/token
router.post("/token", fetchnewuser, async (req, res) => {

})

//Route for fetching user details : /api/v1/user/details
router.post("/details", fetchuser, async (req, res) => {
    try {
        // console.log(req.user);
        const newuser = req.user.phone || req.user[0].phone;
        // console.log(newuser[0].phone)
        const user1 = await userSchema.findOne({ phone: newuser });
        // console.log(user1);
        res.status(200).json(user1);
    }
    catch (err) {
        console.log(err.message)
        res.status(500).json(err)
    }

})

//Route for fetching available time slots : /api/v1/user/timeSlots
router.post("/timeSlots", [
    body('email', 'Enter a valid Email').isEmail()
], fetchuser, async (req, res) => {

    try {

        // const turfname = req.body.turfname;
        const turfs = [];
        var timeslots = []
        // const dum = booking.date;
        // console.log(req.body.date);
        // console.log(new Date(req.body.date))
        const turf = await bookSchema.find({ $and: [{ email: req.body.email }, { name: req.body.name }, { "booking.date": new Date(req.body.date) }, { "booking.turfNo": req.body.turfNo }] });
        // console.log(turf)
        for (var i = 0; i < turf.length; i++) {
            timeslots[i] = turf[i].booking.time;
        }

        //Code for removing time slots of instant book from app
        // const turfTime = await bookSchema.find({ $and: [{ email: req.body.email }, { name: req.body.name }, { "booking.date": new Date(req.body.date) }, { "booking.turfNo": req.body.turfNo }] });
        // // console.log(turf)
        // for (var i = 0; i < turfTime.length; i++) {
        //     timeslots.push(turfTime[i].booking.time);
        // }
        // console.log(timeslots.toString());
        res.status(200).json(timeslots.toString());

    }
    catch (err) {
        console.log(err.message)
        res.status(400).json(err);
    }

})

//Route for editing user profile : /api/v1/user/edit
router.post("/edit", fetchuser, multer.upload.single("avatar"), async (req, res) => {
    try {

        let avatar = req.user || req.user[0];
        // console.log(avatar)
        const user1 = await userSchema.findOne({ phone: req.user.phone || req.user[0].phone })
        // console.log(user1)
        // console.log(user1.avatar)
        // console.log("     sjdj   ")
        let newAvatar;
        if (req.file) {
            newAvatar = `${process.env.Book2play_URI}api/image/${req.file.filename}`

            let temp = []
            let gfs = multer.gfs.grid
            let filename = user1.avatar || user1[0].avatar
            // console.log(user1[0].avatar);
            // console.log(filename);

            temp = filename.split("/")
            console.log(temp)
            let removingFile = temp[temp.length - 1]
            // user_icon_1662560350693undefined
            // console.log(removingFile);
            try {

                await gfs.files.deleteOne({ filename: removingFile })
                console.log("Done")
            } catch (error) {
                console.log("Not Done")
            }
        }
        else {
            newAvatar = user1.avatar || user1[0].avatar;
        }
        await userSchema.findOne({ phone: req.user.phone || req.user[0].phone })
            .exec()
            .then(async user => {
                // console.log(user)
                const edit = {
                    $set: {
                        avatar: newAvatar,
                        name: req.body.name ? req.body.name : user1.name || user1[0].name
                    }
                }
                // console.log(edit)
                const result = await userSchema.updateOne(user1, edit);
                res.status(200).json(result);
            })

    } catch (err) {
        console.log(err.message)
        res.status(500).json(err.message);
    }
})

//Route for checking if user already exists : /api/v1/user/exists
router.post("/exists", async (req, res) => {
    try {
        let phone = req.body.phone;

        let found = await userSchema.find({ phone: phone });

        if (found.length > 0) {
            res.status(201).json("User already exists!")
        }
        else {
            res.status(200).json("Continue")
        }
    } catch (err) {
        console.log(err.message)
        res.status(500).json(err.message)
    }
})

//Route for fetching previous bookings : /api/v1/user/previous
router.post("/previous", fetchuser, async (req, res) => {
    try {
        var d = new Date();
        // d.setDate(d.getDate() - 1);
        const user = await userSchema.findOne({ phone: req.user.phone })
        const previous = user.booking;
        previous.sort(function (a, b) { return b.date.getTime() - a.date.getTime() });
        // console.log(previous)
        var empStart = previous.filter(item => {
            return new Date(item.date).getTime() < d
        })
        res.status(200).json(empStart)
    }
    catch (err) {
        console.log(err.message)
        res.status(500).json(err.message);
    }
})

//Route for fetching confirmed bookings : /api/v1/user/confirmed
router.post("/confirmed", fetchuser, async (req, res) => {

    try {
        var d = new Date();
        d.setDate(d.getDate() - 1);
        // console.log(d)
        // console.log(d.getTime()-1)
        const user = await userSchema.findOne({ phone: req.user.phone || req.user[0].phone })
        const upComing = user.booking;
        upComing.sort(function (a, b) { return a.date.getTime() - b.date.getTime() });
        // console.log(upComing)
        var empStart = upComing.filter(item => {
            return new Date(item.date).getTime() >= d
        })

        res.status(200).json(empStart)
    }
    catch (err) {
        console.log(err.message)
        res.status(500).json(err.message);
    }

})

//Route for checking if slot already booked or not by a user : /api/v1/user/slot/check
router.post('/slot/check', fetchuser, async (req, res) => {
    try {
        const bookingCheck = await userSchema.findOne({ phone: req.user.phone || req.user[0].phone })

        // console.log(bookingCheck.pending)
        const pendingBooks = bookingCheck.pending
        // console.log(pendingBooks)

        for (let i = 0; i < pendingBooks.length; i++) {
            if (pendingBooks[i].date.getTime() == new Date(req.body.bookRequest[0].date).getTime() && pendingBooks[i].time === req.body.bookRequest[0].time && pendingBooks[i].turfNo === req.body.bookRequest[0].turfNo && pendingBooks[i].venueName === req.body.name && pendingBooks[i].venueemail === req.body.email) {
                return res.status(400).json({ message: "You have already booked this slot!" })
            }
        }

        const newDraft = new DraftSchema({
            "venueemail": req.body.email,
            "venueName": req.body.name,
            "turfNo": req.body.bookRequest[0].turfNo,
            "date": new Date(req.body.bookRequest[0].date),
            "time": req.body.bookRequest[0].time,
            "price": req.body.bookRequest[0].price,
            "phone": req.user.phone || req.user[0].phone,
            "name": bookingCheck.name
        })

        const saved = await newDraft.save();
        res.status(200).json({ message: "Data saved successfully!" })

    } catch (err) {
        console.log(err.message)
        res.status(500).json(err.message)
    }
})

//Route for notifications fetch: /api/v1/user/notifications
router.post("/notifications", fetchuser, async (req, res) => {
    try {
        // console.log(req.user)

        const user = await NotificationSchema.find({ phone: req.user.phone || req.user[0].phone });
        // console.log(user)
        res.status(200).json(user.reverse())
    } catch (err) {
        console.log(err.message)
        res.status(500).json(err.message);
    }
})


//Route for forgot password : /api/v1/user/forgotPassword
router.post("/forgotPassword", [
    body('phone', 'Enter a valid phone number').isLength({ min: 13, max: 13 })
], async (req, res) => {
    try {


        const phoneuser = { phone: req.body.phone }
        userSchema.findOne({ phone: req.body.phone })
            .exec()
            .then(async user => {
                // if (user.user_id == req.body.user_id) {
                const salt = genSaltSync(10);

                const newpass = { $set: { password: hashSync(req.body.password, salt) } };
                try {
                    const result = await userSchema.updateOne(phoneuser, newpass);
                    res.status(200).json(result);
                }

                catch (err) {
                    console.log(err.message)
                    res.status(400).json({ message: err.message });
                }
                // }
                // else {
                //     res.status(404).json("User id did not match");
                // }
            });

    }
    catch (err) {
        console.log(err.message)
        res.status(500).json(err.message)
    }
});

module.exports = router