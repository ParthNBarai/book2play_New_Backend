const mongoose = require('mongoose')

const SuggestionSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
})

module.exports = mongoose.model('suggestions', SuggestionSchema)