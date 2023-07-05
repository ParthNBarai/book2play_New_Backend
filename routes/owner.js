const express = require('express')
const router = express.Router();
const { body, validationResult } = require('express-validator');
const multer = require('../middleware/multer')
const auth = require('../Authentication/GetBearerToken')
const adminSchema = require('../schemas/OwnerSchema')
const venueSchema = require('../schemas/VenueSchema')
const instantBookSchema = require('../schemas/InstantBookSchema')
const userSchema = require('../schemas/UserSchema')
const bookSchema = require('../schemas/BookingSchema')
const NotificationSchema = require('../schemas/NotificationSchema')
const OwnerNotificationSchema = require('../schemas/OwnerNotificationSchema')
const pushNotificationService = require('../Notifications/push-notification.services')
const pushNotificationServiceOwner = require('../Notifications/push-notifications_owner')
const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const { sign, verify } = require("jsonwebtoken");
const { JsonWebTokenError } = require("jsonwebtoken");
const jwt = require("jsonwebtoken");
require("dotenv/config");


//Route for signup of owner : /api/v1/owner/signup
router.post("/signup", [
    body('name', 'Enter a valid Name').isLength({ min: 3 }),
    body('email', 'Enter a valid Email').isEmail(),
    body('password', 'Password must be atleast 8 characters').isLength({ min: 8 }),
    body('pincode', 'Enter a valid pincode').isLength({ min: 6, max: 6 }),
    body('phone', 'Enter a valid phone number').isLength({ min: 13, max: 13 })
], multer.upload.array("turfs"), async (req, res) => {

    try {
        const salt = genSaltSync(10);
        req.body.password = hashSync(req.body.password, salt);
        const admin = new adminSchema({

            email: req.body.email,
            password: req.body.password,
            name: req.body.name,
            pincode: req.body.pincode,
            phone: req.body.phone,

        });



        const saved = await admin.save();
        if (saved) {
            admin.password = undefined;
            // const jsontoken = sign({ result: admin }, process.env.Token_id, {
            //     expiresIn: 60 * 60 * 24 * 30
            // });
            const jsontoken = await auth.tokenGenerate(admin);
            return res.status(200).json({
                success: 1,
                message: "Successful signup",
                token: jsontoken

            });
        }
        else {
            console.log(err.message)
            return res.status(403).json({
                error: {
                    message: "Please provide all details"
                }
            })
        }
    }

    catch (err) {
        console.log(err.message)
        res.status(400).json({ message: err.message });
    }


});

//Route for owner login : /api/v1/owner/login
router.post("/login", [
    body('email', 'Enter a valid Email').isEmail(),
    body('password', 'Password must be atleast 8 characters').isLength({ min: 8 })
], async (req, res) => {
    try {
        adminSchema.find({ email: req.body.email })
            .exec()
            .then(async admin => {

                if (admin.length < 1) {
                    return res.status(403).json({
                        error: {
                            message: "User Not Found, Kindly Register!"
                        }
                    })
                }
                else {
                    const result = compareSync(req.body.password, admin[0].password);
                    if (result) {
                        admin.password = undefined;
                        // const jsontoken = sign({ result: admin }, process.env.Token_id, {
                        //     expiresIn: 60 * 60 * 24 * 30
                        // });
                        const jsontoken = await auth.tokenGenerate(admin);
                        return res.status(200).json({
                            success: 1,
                            message: "Successful login",
                            token: jsontoken

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
        res.status(500).json(err.message);
    }
});

//Route for adding new venue : /api/v1/owner/venue
router.post("/venue", [
    body('email', 'Enter a valid Email').isEmail()
], multer.upload.array("images", 5), async (req, res) => {
    let price = JSON.parse(req.body.price)
    let turfs = parseInt(req.body.turfs)
    try {
        const venue = new venueSchema({

            email: req.body.email,
            name: req.body.name,
            place: req.body.place,
            device_id: req.body.device_id,
            typeofvenue: req.body.typeofvenue,
            "price.weekdays.morning.time": price.weekdays.morning.time,
            "price.weekdays.morning.price": price.weekdays.morning.price,
            "price.weekdays.evening.time": price.weekdays.evening.time,
            "price.weekdays.evening.price": price.weekdays.evening.price,
            "price.weekends.morning.time": price.weekends.morning.time,
            "price.weekends.morning.price": price.weekends.morning.price,
            "price.weekends.evening.time": price.weekends.evening.time,
            "price.weekends.evening.price": price.weekends.evening.price,
            location: req.body.location,
            pincode: req.body.pincode,
            address: req.body.address,
            date: new Date(),
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            turfs: turfs,
            // ratings : "3.0"
            // reviews :{
            //     "firstname" : req.body.reviews[0].firstname,
            //     "lastname"  : req.body.reviews[0].lastname
            // }

        });

        // const review = req.body.reviews;
        // console.log(review[0].firstname)

        for (i = 0; i < req.body.sports.length; i++) {
            venue.sports.push(req.body.sports[i]);
        }

        for (i = 0; i < req.body.phone.length; i++) {
            venue.phone.push(req.body.phone[i]);
        }

        for (i = 0; i < req.files.length; i++) {
            venue.images.push(`${process.env.Book2play_URI}api/image/${req.files[i].filename}`);
        }
        const saved = await venue.save();
        res.status(200).json(saved);

    }
    catch (err) {
        console.log(err.message)
        res.status(500).json({ message: err.message });
    }
});


//Route for fetching venues of a particular owner : /api/v1/owner/venue
// router.post("/:type", [
//     body('email', 'Enter a valid Email').isEmail()
// ], async (req, res) => {
//     try {

//         const ownerHome = await venueSchema.find({ email: req.body.email });
//         res.status(200).json(ownerHome);
//     }

//     catch (err) {
//         console.log(err.message)
//         res.status(500).json(err.message);
//     }
// });


//Route for details of owner : /api/v1/owner/details 
router.post("/details", [
    body('email', 'Enter a valid Email').isEmail()
], async (req, res) => {
    try {
        // console.log(req.owner);
        const newuser = req.body.email;
        // console.log(newuser)
        const user1 = await adminSchema.findOne({ email: newuser });
        // console.log(user1);
        res.status(200).json(user1);
    }
    catch (err) {
        console.error(err.message)
        res.status(500).json(err)
    }
})

//Route for fetching owner profile : /api/v1/owner/profile
router.post("/profile", (req, res) => {
    try {
        // console.log(req.owner);
        const t = req.body.email;
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
});

//Route for fetching a turf : /api/v1/owner/email
router.post("/email", [
    body('email', 'Enter a valid Email').isEmail()
], async (req, res) => {
    try {
        const venue = await venueSchema.find({ $and: [{ email: req.body.email }, { name: req.body.name }] });
        res.status(200).json(venue);
    }
    catch (err) {
        console.log(err.message)
        res.status(500).json({ message: err.message });
    }
})


//Route for fetching names of turf : /api/v1/owner/name
router.post("/name", [
    body('email', 'Enter a valid Email').isEmail()
], async (req, res) => {
    try {
        const venue = await venueSchema.find({ email: req.body.email })
            .exec()
            .then(async user => {
                const turfName = [];
                for (i = 0; i < user.length; i++) {
                    turfName[i] = user[i].name;
                }
                res.status(200).json(turfName);

            })
    }
    catch (err) {
        console.log(err.message)
        res.status(500).json({ message: err.message });
    }
})

//Route for owner instant book : /api/v1/owner/instantBook
router.post("/instantBook", [
    body('email', 'Enter a valid Email').isEmail(),
    body('phone', 'Enter a valid phone number').isLength({ min: 13, max: 13 })
], async (req, res) => {
    try {
        // console.log(req.body.booking)

        const instantbook = new instantBookSchema({
            ownerEmail: req.body.email,
            ownerName: req.body.name,
            userName: req.body.username,
            userPhone: req.body.phone,

            booking: {
                date: new Date(req.body.booking.date),
                time: req.body.booking.time,
                price: req.body.booking.price
            }
        })
        const newSave = await instantbook.save();
        res.status(200).json(newSave);

    }
    catch (err) {
        console.log(err.message)
        res.status(400).json(err);
    }
})

//Route for owner bookings for owner : /api/v1/owner/bookings/turf
router.post("/bookings/:result", [
    body('email', 'Enter a valid Email').isEmail()
], async (req, res) => {
    try {
        const books = await bookSchema.find({ $and: [{ owneremail: req.body.email }, { ownername: req.body.name }] });
        // console.log(books)
        res.status(200).json(books);
    }
    catch (err) {
        console.log(err.message)
        res.status(400).json({ message: err.message });
    }
})


//Route for owner pending details : /api/v1/owner/pending
router.post("/pending", [
    body('email', 'Enter a valid Email').isEmail()
], async (req, res) => {
    try {
        // console.log(req.owner);
        const pending = await venueSchema.find({ $and: [{ email: req.body.email }, { name: req.body.name }] });
        // console.log(pending[0].bookRequest[0]);
        const sorted = pending[0].bookRequest;
        // sorted.sort(function (a, b) { return a.date.getTime() - b.date.getTime() });
        // console.log(sorted)
        // console.log(pending);
        // console.log(sorted);
        res.status(200).json(sorted)
    } catch (err) {
        console.log(err.message)
        res.status(500).json(err)
    }
});

//Route for reports  : /api/v1/owner/reports
router.post("/reports", [
    body('email', 'Enter a valid Email').isEmail()
], async (req, res) => {
    try {


        let reportdetails = [];
        let date = new Date(req.body.date)
        let predate = new Date(req.body.predate)
        // console.log(predate)
        date.setDate(date.getDate() + 1);
        // predate.setDate(predate.getDate() - 1);
        // console.log(predate)
        const results = await bookSchema.find({
            $and: [{ owneremail: req.body.email }, { ownername: req.body.name },
            {
                "booking.date": {
                    $lte: date,
                    $gte: new Date(req.body.predate),
                }
            }]
        }, { username: 1, phone: 1, booking: 1 }).sort({ "booking.date": -1 })
        // console.log(results[0].username)

        for (let i = 0; i < results.length; i++) {
            reportdetails[i] = results[i];
        }


        res.status(200).json(reportdetails);
    }
    catch (err) {
        console.log(err.message)
        res.status(500).json(err.message)
    }
})


//Route for fetching previous bookings : /api/v1/owner/previous
router.post("/previous", [
    body('email', 'Enter a valid Email').isEmail()
], async (req, res) => {
    try {
        var d = new Date();
        // d.setDate(d.getDate() - 1);
        const previousBookings = await bookSchema.find({
            $and: [{ owneremail: req.body.email }, { ownername: req.body.name }, {
                "booking.date": {
                    $lt: new Date(d)
                }
            }]
        }).sort({ "booking.date": -1 });

        // console.log(previousBookings)
        // previousBookings.sort(function (a, b) { return b.date.getTime() - a.date.getTime() });

        res.status(200).json(previousBookings)
    } catch (err) {
        console.log(err.message)
        res.status(500).json(err.message);
    }
})


//Route for fetching confirmed bookings : /api/v1/owner/confirmed
router.post("/confirmed", [
    body('email', 'Enter a valid Email').isEmail()
], async (req, res) => {

    try {
        var d = new Date();
        // d.setDate(d.getDate() - 1);
        const previousBookings = await bookSchema.find({
            $and: [{ owneremail: req.body.email }, { ownername: req.body.name }, {
                "booking.date": {
                    $gte: new Date(d)
                }
            }]
        }).sort({ "booking.date": 1 });
        // console.log(previousBookings)
        res.status(200).json(previousBookings)
    } catch (err) {
        console.log(err.message)
        res.status(500).json(err.message);
    }

})


//Route for instant booking : /api/v1/owner/instant
router.post("/instant", [
    body('email', 'Enter a valid Email').isEmail()
], async (req, res) => {

    try {
        const instantBooks = await instantBookSchema.find({ $and: [{ owneremail: req.body.email }, { ownername: req.body.name }] });
        res.status(200).json(instantBooks)
    } catch (err) {
        console.log(err.message)
        res.status(500).json(err.message);
    }


})


//Route for fetching all the turfs of a particular owner : /api/v1/owner/turffetch
router.post("/turffetch", [
    body('email', 'Enter a valid Email').isEmail()
], async (req, res) => {
    try {
        const turfOwner = await venueSchema.find({ email: req.body.email });
        res.status(200).json(turfOwner);
    }
    catch (err) {
        console.log(err.message)
        res.status(400).json({ message: err.message });
    }
})


//Route for forgot password : /api/v1/owner/forgotPassword
router.post("/forgotPassword", [
    body('email', 'Enter a valid Email').isEmail()
], async (req, res) => {
    try {
        const emailIdowner = { email: req.body.email }
        adminSchema.findOne({ email: req.body.email })
            .exec()
            .then(async admin => {

                const salt = genSaltSync(10);
                const newpass = { $set: { password: hashSync(req.body.password, salt) } };

                try {
                    const result = await adminSchema.updateOne(emailIdowner, newpass);
                    res.status(200).json(result);
                }
                catch (err) {
                    console.log(err.message)
                    res.status(400).json({ message: err.message });
                }
            });

    }
    catch (err) {
        console.log(err.message)
        res.status(500).json(err.message)
    }
});


router.post("/reports/offline", [
    body('email', 'Enter a valid Email').isEmail()
], async (req, res) => {
    try {

        let reportdetails = [];
        let date = new Date(req.body.date)
        let predate = new Date(req.body.predate)
        // console.log(predate)
        date.setDate(date.getDate() + 1);
        // predate.setDate(predate.getDate() - 1);
        // console.log(predate)
        const results = await instantBookSchema.find({
            $and: [{ owneremail: req.body.email }, { ownername: req.body.name },
            {
                "booking.date": {
                    $lte: date,
                    $gte: new Date(req.body.predate),
                }
            }]
        }, { userName: 1, userPhone: 1, booking: 1 }).sort({ "booking.date": -1 })
        // console.log(results[0].username)

        for (let i = 0; i < results.length; i++) {
            reportdetails[i] = results[i];
        }


        res.status(200).json(reportdetails);
    }
    catch (err) {
        console.log(err.message)
        res.status(500).json(err.message)
    }
})

module.exports = router