const express = require('express')
const router = express.Router();
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser')
const ReviewFunctions = require('../Functions/ReviewFunctions')
require("dotenv/config");


//Route for reviews saving : /api/v1/review
router.post("/", fetchuser, async (req, res) => {
    await ReviewFunctions.review(req, res);
    await ReviewFunctions.userReview(req, res);
    await ReviewFunctions.ratings(req, res)
})

module.exports = router