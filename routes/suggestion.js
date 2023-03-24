const express = require('express')
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const SuggestionSchema = require('../schemas/SuggestionsSchema');
const { route } = require('./user');

//Route for suggestions add: /api/v1/suggestion/add
router.post('/add', fetchuser, async (req, res) => {
    try {
        const newSuggestion = new SuggestionSchema({
            username: req.body.name,
            phone: req.user.phone,
            desc: req.body.desc,
            date: new Date(Date.now())
        })

        const saved = await newSuggestion.save()
        res.status(200).json(saved)
    } catch (err) {
        console.log(err.message)
        res.status(400).json({ message: err.message });
    }
})

module.exports = router