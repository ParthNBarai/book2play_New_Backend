const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({

    owneremail: {
        type: String,
        required: true
    },
    ownername: {
        type: String,
        required: true
    },

    username: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    turfNo: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    paymentId: {
        type: String,
        required: true
    },
    orderId: {
        type: String,
        required: true
    },
    signature: {
        type: String,
        required: true
    }

});

module.exports = mongoose.model('Bookings', bookSchema);