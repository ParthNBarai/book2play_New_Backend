const bookingSchema = require('../schemas/BookingSchema')
const createHtml = require('../CreateNewPdf/createTable')
require("dotenv/config");

async function bookings(email) {
    try {
        // console.log(email)
        const today = Date.now();
        // console.log(Date(today))
        // console.log(Date(today - 864e5))
        // console.log(new Date(Date.now() - 2 * 864e5));
        let yesterday = new Date(Date.now() - 2 * 864e5);
        let newDate = [];
        let timings = [];
        const books = await bookingSchema.find({
            $and: [{ owneremail: email }, {
                "booking.date": {

                    $gt: new Date(yesterday),
                }
            }]
        });
        // const book = await bookingSchema.find();
        console.log(books);
        for (let i = 0; i < books.length; i++) {
            let day = books[i].booking.date.getDate();
            let month = books[i].booking.date.getMonth() + 1;
            let year = books[i].booking.date.getFullYear();

            newDate[i] = day + "/" + month + "/" + year;
            // console.log(books[i].booking.time)
            timings[i] = books[i].booking.time.split('-');
            // console.log(timings[i][0] +"-" + timings[i][timings[i].length-1]);
            books[i].booking.time = timings[i][0] + "-" + timings[i][timings[i].length - 1];

        }
        // console.log(books[0].booking.time);

        if (books.length > 0) {

            createHtml.htmlCreate(books, newDate)
        }
        else {
            console.log("No bookings!")
            // createHtml.htmlCreate(data, newDate)
        }


        // console.log(books);
        // console.log(books.length);
    } catch (err) {
        console.log(err)
        // res.status(500).json(err)
    }
}

async function totalTurfs() {
    const allBookings = await bookingSchema.find();
    let emails = [];
    let names = [];
    let j = 0;
    for (let i = 0; i < allBookings.length; i++) {
        if (!emails.includes(allBookings[i].owneremail)) {
            emails[j] = allBookings[i].owneremail;
            names[j] = allBookings[i].ownername;
            j++;
        }

    }
    for (let i = 0; i < emails.length; i++) {
        bookings(emails[i]);
    }
    // bookings(emails[0],names[0]);
    console.log(emails);
    console.log(emails.length);
}