const mongoose = require('mongoose')

const NotificationSchema = mongoose.Schema({
    device_id: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        // unique: true,
        // required : true
    },
    contents: {
        type: Object
    },
    date: {
        type: Date,
        // unique: true,
        required: true
    },

})

module.exports = mongoose.model('notifications', NotificationSchema);