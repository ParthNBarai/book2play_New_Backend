const mongoose = require("mongoose");


const venueSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    device_id: {
        type: String,
        required: true
    },
    typeofvenue: {
        type: String,
        required: true
    },
    place: {
        type: String,
        required: true
    },

    rating: {
        type: String,
    },

    turfs: {
        type: Number,
        required: true
    },
    price: {
        weekdays: {
            morning: {
                time: {
                    type: String,
                    required: true
                },
                price: {
                    type: String,
                    required: true
                }
            },
            evening: {
                time: {
                    type: String,
                    required: true
                },
                price: {
                    type: String,
                    required: true
                }
            }
        },
        weekends: {
            morning: {
                time: {
                    type: String,
                    required: true
                },
                price: {
                    type: String,
                    required: true
                }
            },
            evening: {
                time: {
                    type: String,
                    required: true
                },
                price: {
                    type: String,
                    required: true
                }
            }
        }
    },

    location: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    sports: [{
        type: String,
        required: true
    }],
    date: {
        type: String,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    images: [{
        type: String,
        required: true
    }],
    phone: [{
        type: String,
        required: true
    }],
    ratings: {
        type: String,
        default: "3.0"
    },
})

module.exports = mongoose.model('venues', venueSchema);