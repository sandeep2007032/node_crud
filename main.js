// imports
require("dotenv").config();
const express = require("express"); 
const mongoose = require('mongoose');
const testRouter = require("./routes/routes");
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 9000;

// Database connection
mongoose.connect(process.env.DB_URI).then(() => {
    console.log("Database connected");
}).catch(error => {
    console.error(`Error connecting to database: ${error}`);
});

// Middleware setup
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
}));

app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message; 
    next();
});

app.use(express.static('uploads'));
app.set("view engine", "ejs");

// Route setup
app.use(testRouter);

// Start the server
app.listen(PORT, () => {
    console.log(`Server started at :${PORT}`);
});
