const express = require('express')
const router = express.Router();
const { body, validationResult } = require('express-validator');
const multer = require('../middleware/multer')
const venueSchema = require('../schemas/VenueSchema')
const reviewSchema = require('../schemas/ReviewSchema')

require("dotenv/config");


//Route for fetching all venues : /api/v1/venue/fetchAll/venue
router.get("fetchAll/venue", async (req, res) => {
    try {
        const venue = await venueSchema.find();
        res.status(200).json(venue);
    }
    catch (err) {
        console.log(err.message)
        res.status(500).json({ message: err.message });
    }
});


//Route for finding a venue : /api/v1/venue/find/venue
router.post("/find/venue", async (req, res) => {
    try {
        const venueSearch = await venueSchema.find({ $or: [{ name: { $regex: `${req.body.name}`, $options: 'i' } }, { address: { $regex: `${req.body.address}`, $options: 'i' } }] });
        res.status(200).json(venueSearch);
    } catch (err) {
        console.log(err.message)
        res.status(500).json(err.message);
    }
});


//Route for edit turf : /api/v1/venue/editTurf
router.post("/editTurf", [
    body('email', 'Enter a valid Email').isEmail(),
    body('phone', 'Enter a valid phone number').isLength({ min: 13, max: 13 })
], multer.upload.array("images", 5), async (req, res) => {

    try {

        const user1 = await venueSchema.findOne({ $and: [{ email: req.body.email }, { name: req.body.name }] })
        // console.log(user1)
        // let avatar = req.user || req.user[0];

        let sports = [];
        let phone = [];
        let images = [];
        // console.log(user1.images.length)
        if (req.body.sports) {
            for (let i = 0; i < req.body.sports.length; i++) {
                // console.log(req.body.sports[i])
                sports.push(req.body.sports[i]);
            }
        }
        else {
            for (let i = 0; i < user1.sports.length; i++) {
                // console.log(user1.sports[i]);
                sports.push(user1.sports[i]);
            }
        }


        if (req.body.phone) {
            for (let i = 0; i < req.body.phone.length; i++) {
                // console.log(req.body.phone[i])
                phone.push(req.body.phone[i]);
            }

        }
        else {
            for (let i = 0; i < user1.phone.length; i++) {
                phone.push(user1.phone[i]);
            }

        }

        if (req.files.length > 0) {
            for (let i = 0; i < req.files.length; i++) {
                // console.log(req.files[i].filename)
                images.push(`${process.env.Book2play_URI}/api/image/${req.files[i].filename}`);

            }
            for (let i = 0; i < user1.images.length; i++) {
                let gfs = multer.gfs.grid
                let temp = []


                let filename = user1.images[i];
                temp = filename.split("/")
                let removingFile = temp[temp.length - 1]

                try {

                    await gfs.files.deleteOne({ filename: removingFile })
                    console.log("Done")
                } catch (error) {
                    console.log("Not Done")
                }
            }

        }
        else {
            for (let i = 0; i < user1.images.length; i++) {
                images.push(user1.images[i]);
            }
            // console.log("else")
            // console.log(images)

        }
        const saved = await venueSchema.findOne({ $and: [{ email: req.body.email }, { name: req.body.name }] })
            .exec()
            .then(async venue => {
                let parsedPrice;
                let parsedTurfs;
                let newName = venue.name;
                // console.log(req.body.startTime)
                // console.log(venue)
                if (req.body.price) {
                    parsedPrice = JSON.parse(req.body.price)
                }
                if (req.body.newName) {
                    newName = req.body.newName
                }
                if (req.body.turfs) {
                    parsedTurfs = parseInt(req.body.turfs)
                }
                let price = req.body.price ? parsedPrice : venue.price
                let turfs = req.body.turfs ? parsedTurfs : venue.turfs
                const edit = {
                    $set: {
                        name: newName,
                        typeofvenue: req.body.typeofvenue ? req.body.typeofvenue : venue.typeofvenue,
                        "price.weekdays.morning.time": price.weekdays.morning.time ? price.weekdays.morning.time : venue.price.weekdays.morning.time,
                        "price.weekdays.morning.price": price.weekdays.morning.price ? price.weekdays.morning.price : venue.price.weekdays.morning.price,
                        "price.weekdays.evening.time": price.weekdays.evening.time ? price.weekdays.evening.time : venue.price.weekdays.evening.time,
                        "price.weekdays.evening.price": price.weekdays.evening.price ? price.weekdays.evening.price : venue.price.weekdays.evening.price,
                        "price.weekends.morning.time": price.weekends.morning.time ?
                            price.weekends.morning.time : venue.price.weekends.morning.time,
                        "price.weekends.morning.price": price.weekends.morning.price ? price.weekends.morning.price : venue.price.weekends.morning.price,
                        "price.weekends.evening.time": price.weekends.evening.time ? price.weekends.evening.time : venue.price.weekends.evening.time,
                        "price.weekends.evening.price": price.weekends.evening.price ? price.weekends.evening.price : venue.price.weekends.evening.price,
                        startTime: req.body.startTime ? req.body.startTime : venue.startTime,
                        endTime: req.body.endTime ? req.body.endTime : venue.endTime,
                        turfs: turfs ? turfs : venue.turfs,
                        images: images,
                        sports: sports,
                        phone: phone
                    },
                }
                // console.log(edit)
                const result = await venueSchema.updateOne(user1, edit);

                res.status(200).json({
                    result: result,
                });

            })


    } catch (err) {
        console.log(err.message)
        res.status(500).json(err.message);
    }
});


//Route for fetching turf reviews : /api/v1/venue/reviews
router.post("/reviews", [
    body('email', 'Enter a valid Email').isEmail()
], async (req, res) => {

    try {
        const reviews = await reviewSchema.find({ $and: [{ "review.venueemail": req.body.email }, { "review.venueName": req.body.name }] });
        // console.log(reviews)
        res.status(200).json(reviews.reverse());
    } catch (err) {
        console.log(err.message)
        res.status(500).json(err.message)
    }
});


// Route for fetching turf ratings : /api/v1/venue/ratings
router.post("/ratings", async (req, res) => {
    try {
        let total = 0;
        let averageRating;
        const reviews = await reviewSchema.find({ $and: [{ "review.venueemail": req.body.review[0].venueemail }, { "review.venueName": req.body.review[0].venuename }] });
        // console.log(reviews.length)
        if (reviews.length > 0) {

            for (let i = 0; i < reviews.length; i++) {
                total += Number(reviews[i].review.rating)
            }

            averageRating = Math.ceil(total / reviews.length);
            // console.log(averageRating)
        }

        else {
            averageRating = "3.0"
        }
        // console.log(averageRating)
        const saved = await venueSchema.updateOne({ $and: [{ email: req.body.review[0].venueemail }, { name: req.body.review[0].venuename }] }, {
            $set: {
                ratings: averageRating.toString()
            }
        })
        // console.log(saved)
        // res.status(200).json(saved);
    } catch (err) {
        console.log(err.message)
        res.status(500).json(err.message)
    }
});

module.exports = router