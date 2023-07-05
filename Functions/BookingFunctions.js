const mongoose = require('mongoose')
// const  ObjectId = require("mongodb").ObjectID;
const userSchema = require('../schemas/UserSchema')
const bookSchema = require('../schemas/BookingSchema')
const bookRequestSchema = require('../schemas/BookRequestSchema')
const venueSchema = require('../schemas/VenueSchema')
const ReferralFunctions = require('../Functions/ReferralFunctions')
const UserSchema = require('../schemas/UserSchema')
const BookRequestSchema = require('../schemas/BookRequestSchema')
require("dotenv/config");


async function userPointUpdates(req, res) {
    const userDetails = await BookRequestSchema.findById(req.body.id)
    console.log(userDetails)
    const user = await UserSchema.findOne({ phone: userDetails.phone })
    req.body.referral = user.referral
    ReferralFunctions.referred(req, res);
}

async function bookingRequest(req, res) {
        const user = await userSchema.findOne({ phone: req.body.phone })
        console.log(req.body.name)
        // console.log(req.user.name);
        // console.log(req.user.phone);
        // let name = req.user.name||req.user[0].name
        // console.log(name)

        const newBookRequest = new bookRequestSchema({
            "venueemail": req.body.email,
            "venueName": req.body.name,
            "username": user.name,
            "phone": req.body.phone || req.user[0].phone,
            "turfNo": req.body.bookRequest[0].turfNo,
            "date": new Date(req.body.bookRequest[0].date),
            "time": req.body.bookRequest[0].time,
            "price": req.body.bookRequest[0].price,
            "paymentId": req.body.bookRequest[0].paymentId,
            "orderId": req.body.bookRequest[0].orderId,
            "signature": req.body.bookRequest[0].signature,
        })

        const saved = await newBookRequest.save();
        res.status(200).json(saved);

    

}

async function bookRequestDelete(req, res) {
        const deleteRequest = await bookRequestSchema.deleteOne({
            "_id": mongoose.Types.ObjectId(req.body.id)
        })
        console.log(deleteRequest)
        console.log("Request Deleted Successfully!")
}

async function book(req, res) {
        const confirmBooking = await bookRequestSchema.findById(req.body.id)
        console.log(confirmBooking)
        const book = new bookSchema({
            owneremail: confirmBooking.venueemail,
            ownername: confirmBooking.venueName,
            // useremail: venueBookRequest[0].bookRequest[req.body.index].useremail,
            username: confirmBooking.username,
            phone: confirmBooking.phone,
            turfNo: confirmBooking.turfNo,
            date: confirmBooking.date,
            time: confirmBooking.time,
            price: confirmBooking.price,
            paymentId: confirmBooking.paymentId,
            orderId: confirmBooking.orderId,
            signature: confirmBooking.signature,

        });

        const saved = await book.save();
        console.log(saved)
        res.status(200).json(saved);
        // console.log(saved)
}


module.exports = { book, userPointUpdates, bookRequestDelete, bookingRequest }