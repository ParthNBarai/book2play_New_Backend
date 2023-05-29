const mongoose = require("mongoose");
// console.log(user-icon)
const userSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true
    },
    // email:{
    //     type : String,
    // },
    password: {
        type: String,
        required: true
    },

    name: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        // required: true
    },
    phone: {
        type: String,
        unique: true,
        required: true
    },
    device_id: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    referral: {

    },
    points: {
        type: Number
    },
    avatar: {
        type: String,
        default: 'http://13.232.4.125:8080/api/image/profile_icon.png_1659857137964parthnb@gmail.com.png'
    },
});



module.exports = mongoose.model('customer', userSchema);