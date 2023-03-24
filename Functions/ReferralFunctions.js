const userSchema = require('../schemas/UserSchema')
require("dotenv/config");


async function referral(req, res) {
    try {
        const cs = req.body.referral
        // console.log(cs)
        if (!req.body.referral) {
            // console.log("reewss")
            return 50;
        }
        else {
            // console.log("else")

            // console.log("ams" +ans2)
            if (await referred(req, res) == true) {
                // console.log("trueeeeeee")
                return 60;
            }
            else {
                return false;
            }
        }
    }
    catch (err) {
        return err
    }

}

function referred(req, res) {
    try {
        const referCode = req.body.referral;
        return new Promise((resolve, reject) => {
            const user = userSchema.find({ referral: req.body.referral });

            // console.log("user" +user)
            if (!user) {
                // console.log("swafedfs")
                resolve(false)
            }
            else {
                userSchema.findOne({ referral: req.body.referral })
                    .exec()
                    .then(async user1 => {
                        console.log(user1.points)
                        // return true
                        // console.log(user.length)
                        if (!user1) {
                            // console.log("!user")
                            resolve(false);
                        }
                        else {
                            const updated = ({
                                $set: {
                                    points: user1.points + 5
                                }

                            })
                            const saved = await userSchema.updateOne(user, updated);
                            console.log(saved)
                            console.log(updated)
                            resolve(true);
                        }

                    })

            }
        })
    }
    catch (err) {
        return err
    }
}

module.exports = { referral, referred }