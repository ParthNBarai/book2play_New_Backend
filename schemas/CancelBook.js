const mongoose = require("mongoose");

const cancelledBookSchema = mongoose.Schema({
    "venueemail": {
        type: String,
        required: true
    },
    "venueName": {
        type: String,
        required: true
    },
    "turfNo": {
        type: Number,
        required: true
    },
    "date": {
        type: Date,
        required: true
    },
    "time": {
        type: String,
        required: true
    },
    "price": {
        type: String,
        required: true
    },
    "paymentId": {
        type: String,
        required: true
    },
    "orderId": {
        type: String,
        required: true
    },
    "signature": {
        type: String,
        required: true
    },
    "status": {
        type: String,
        required: true
    },
    "phone": {
        type: String,
        required: true
    },
    "name": {
        type: String,
        required: true
    },

})

module.exports = mongoose.model('Cancelled Bookings', cancelledBookSchema);