const express = require("express");
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes')
const accountRoutes = require('./routes/accountRoutes')
const portfolioRoutes = require('./routes/portfolioRoutes')
const dividendsRoutes = require('./routes/dividendsRoutes')
const usersRoutes = require('./routes/usersRoutes')
const profileRoutes = require('./routes/profileRoutes')
const followersRoutes = require('./routes/followersRoutes')
const forgotPassRoutes = require('./routes/forgotPassRoutes')

const app = express();

// database
mongoose.connect(process.env.DATABASE, {useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true}).then(() => console.log('DB connected'))

app.use(bodyParser.json());

console.log('hitting server')

// code to deal with CORS error
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
    );
    next();
});

// Route middlewares
app.use(authRoutes)
app.use(accountRoutes)
app.use(portfolioRoutes)
app.use(dividendsRoutes)
app.use(forgotPassRoutes)
// social media routes
app.use(usersRoutes)
app.use(profileRoutes)
app.use(followersRoutes)


// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')));
}

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));