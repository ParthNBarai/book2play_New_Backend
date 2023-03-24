const mongoose = require("mongoose");

const draftSchema = mongoose.Schema({
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
    "phone": {
        type: String,
        required: true
    },
    "name": {
        type: String,
        required: true
    },

})

module.exports = mongoose.model('draft', draftSchema);