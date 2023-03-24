const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
const ConnectionDB = require("./database");
const multer = require('./middleware/multer')

app.use(express.json());
ConnectionDB();

app.use("/api/image", multer.router)
app.use('/api/v1/user', require('./routes/user'))
app.use('/api/v1/venue', require('./routes/venue'))
app.use('/api/v1/review', require('./routes/reviews'))
app.use('/api/v1/razorpay', require('./routes/razorpay'))
app.use('/api/v1/public', require('./routes/publicNoti'))
app.use('/api/v1/owner', require('./routes/owner'))
app.use('/api/v1', require('./routes/cancelAndRefunds'))
app.use('/api/v1/booking', require('./routes/booking'))
app.use('/api/v1/configuration', require('./routes/configuration'))
app.use('/api/v1/suggestion', require('./routes/suggestion'))
app.use('/api/v1/view', require('./routes/prPolicy'))



app.listen(port, () => console.log(`Server up and running...at ${port}`))