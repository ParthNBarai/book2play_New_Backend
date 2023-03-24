const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema({


    payment_id: {
        type: String,
        unique: true,
        required: true,
    },
    status: {
        type: String,
        required: true
    },
    order_id: {
        type: String,
        unique: true,
        required: true,
    },
    amount: {
        type: Number,
        required: true
    },
    payment_method: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },


});

module.exports = mongoose.model('payments', paymentSchema);