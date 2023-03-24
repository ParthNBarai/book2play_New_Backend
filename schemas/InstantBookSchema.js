const mongoose = require('mongoose');

const instantBookSchema = new mongoose.Schema({
    ownerEmail: {
        type: String,
        required: true
    },
    ownerName: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
    },
    userPhone: {
        type: String,
        required: true,
    },
    booking: {
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
    }
})

module.exports = mongoose.model('InstantBook', instantBookSchema);