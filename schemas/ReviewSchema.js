const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema({
    review: {
        venueemail: {
            type: String,
            required: true
        },
        venueName: {
            type: String,
            required: true
        },
        userName: {
            type: String,
            required: true
        },
        comment: {
            type: String,
            required: true
        },
        rating: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true,
            // unique:true
        },
        profile: {
            type: String,
            required: true,
        }
    }
});

module.exports = mongoose.model('reviews', reviewSchema);