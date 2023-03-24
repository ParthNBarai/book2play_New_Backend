const express = require('express')
const router = express.Router();

//Route for view configs /api/v1/configuration/view
router.get("/view", async (req, res) => {
    try {
        configurations = {
            "latest_version": process.env.Latest_version,
            "critical_version": process.env.Crictical_Version,
            "appStore_link": process.env.App_Store,
            "playStore_link": process.env.PlayStore
        }

        res.status(200).json(configurations);
    } catch (err) {
        res.status(500).json(err.message)
    }
})

module.exports = router