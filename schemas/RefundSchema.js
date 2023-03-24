const mongoose = require("mongoose");

const refundSchema = mongoose.Schema({
    refundId: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    paymentId: {
        type: String,
        required: true
    },
    createdAt: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    speed_processed: {
        type: String,
        required: true
    },
    speed_requested: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },

})

module.exports = mongoose.model("Refunds", refundSchema)