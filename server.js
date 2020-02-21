require('dotenv').config();

// Require Libraries
const express = require('express');

const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');


// App Setup
const app = express();
// Middleware
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

// Use Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Add after body parser initialization!
app.use(expressValidator());

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(cookieParser()); // Add this after you initialize express.

// Set db
require('./data/reddit-db');


const checkAuth = (req, res, next) => {
    console.log("Checking authentication");
    if (typeof req.cookies.nToken === "undefined" || req.cookies.nToken === null) {
        req.user = null;
    } else {
        const token = req.cookies.nToken;
        const decodedToken = jwt.decode(token, { complete: true }) || {};
        req.user = decodedToken.payload;
    }

    next();
};
app.use(checkAuth);

// Routes
// app.get('/', (req, res) => {
//     res.render('layouts/main.handlebars');
//   });

app.get("/posts/new", (req, res) => res.render("posts-new"));


//Controllers
require("./controllers/posts")(app);
require('./controllers/comments.js')(app);
require('./controllers/auth.js')(app);

// Start Server

app.listen(3000, () => {
    console.log('Reddit listening on port localhost:3000!');
});

module.exports = app;