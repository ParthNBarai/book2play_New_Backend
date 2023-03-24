const userSchema = require('../schemas/UserSchema')
const venueSchema = require('../schemas/VenueSchema')
const reviewSchema = require('../schemas/ReviewSchema')
require("dotenv/config");

async function review(req, res) {
    try {
        // console.log(req.user.name)
        userSchema.findOne({ phone: req.user.phone || req.user[0].phone })
            .exec()
            .then(async user => {
                // console.log(user)
                const review = new reviewSchema({
                    review: {
                        venueemail: req.body.review[0].venueemail,
                        // email: req.body.review[0].email,
                        venueName: req.body.review[0].venuename,
                        userName: user.name || user[0].name,
                        comment: req.body.review[0].comment,
                        rating: req.body.review[0].rating,
                        phone: req.user.phone || req.user[0].phone,
                        profile: user.avatar || user[0].avatar
                    }
                });
                try {
                    const saved = await review.save();
                    res.status(200).json(saved);
                } catch (err) {
                    console.log(err.message)
                    res.status(500).json({ message: err.message });
                }

            });
    }
    catch (err) {
        console.log(err.message)
        res.status(500).json({ message: err.message });
    }

}


async function userReview(req, res) {
    try {
        // console.log(req.user)

        userSchema.findOne({ phone: req.user.phone || req.user[0].phone })
            .exec()
            .then(async user => {
                // add name using and
                const emailvenue = ({ $and: [{ email: req.body.review[0].venueemail }, { name: req.body.review[0].venuename }] });
                const userreview = {
                    $push: {
                        review: {
                            // "venueemail": req.body.review[0].venueemail,
                            // "useremail": req.body.review[0].email,
                            // "venueName" : req.body.review[0].venueename,
                            userName: user.name || user[0].name,
                            comment: req.body.review[0].comment,
                            rating: req.body.review[0].rating,
                            phone: req.user.phone || req.user[0].phone,
                            profile: user.avatar || user[0].avatar
                        }
                    }
                }

                const result = await venueSchema.updateOne(emailvenue, userreview);
            });
    }
    catch (err) {
        console.log(err.message)
        res.status(500).json(err.message);
    }
}

async function ratings(req, res) {
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

}

module.exports = { review, ratings, userReview }