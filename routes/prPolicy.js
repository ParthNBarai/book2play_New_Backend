const express = require('express')
const router = express.Router();

//Route for viewing prPolicy /api/v1/view/prPolicy
router.get('/prPolicy', async (req, res) => {
    try {
        res.sendFile('privacy policy.txt', { root: __dirname });
    } catch (err) {
        res.status(500).json(err.message)
    }
})

module.exports = router