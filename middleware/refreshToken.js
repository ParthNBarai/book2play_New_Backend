var jwt = require('jsonwebtoken');
require("dotenv/config");
const auth = require("../Authentication/GetBearerToken");


const fetchnewuser = async (req, res, next) => {
    const refreshToken = req.body.refresh_token;
    // console.log("RRRRRRRRRRRR")
    // console.log(refreshToken)
    if (!refreshToken) {
        // console.log("if")
        console.log(req.headers)
        res.status(401).send({ success: false, error: "Please authenticate using a valid token" })
    }
    try {
        // console.log(req.headers)
        // console.log(refreshToken)
        // console.log("else")
        const data = jwt.verify(refreshToken, process.env.Refresh_token_id);
        const user = data.result;

        console.log(data);

        const new_token = await auth.tokenGenerate(user);
        res.status(200).json(new_token);
        next();
    } catch (error) {
        console.log(error)
        res.status(401).send({ success: false, error: "Please authenticate using a Valid token" })
    }
}

module.exports = fetchnewuser;