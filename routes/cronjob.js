const cron = require("node-cron");

// cron.schedule('10 01 * * *', async () => {

//     console.log("cronjob started")
//     scanMails();
//     removingDue();
//     console.log("Cronjob done successfully")
// }, {
//     scheduled: true,
//     timezone: "Asia/Kolkata"
// });

// console.log("Before");
// bookings("parthnbarai1234@gmail.com ");
// totalTurfs();
// console.log("Called");

// console.log(new Date())
// async function deletePendingRequests() {
//     const date = new Date();
//     const users = await userSchema.find();
//     for(let i=0;i<users.length;i++){
//         let pendingRequests = users[i].pending
//         pendingRequests.sort(function (a, b) { return a.date.getTime() - b.date.getTime() });
//         console.log(pendingRequests)
//         for(let j = 0;j<pendingRequests.length;j++){

//         }
//     }
// }