// Require Libraries
const express = require('express');

var cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

// App Setup
const app = express();

app.use(cookieParser()); // Add this after you initialize express.

require('dotenv').config();
// Middleware
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

// Add after body parser initialization!
app.use(expressValidator());

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');



// Use Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Set db
require('./data/reddit-db');


var checkAuth = (req, res, next) => {
    console.log("Checking authentication");
    if (typeof req.cookies.nToken === "undefined" || req.cookies.nToken === null) {
        req.user = null;
    } else {
        var token = req.cookies.nToken;
        var decodedToken = jwt.decode(token, { complete: true }) || {};
        req.user = decodedToken.payload;
    }

    next();
};


app.use(checkAuth);

// Routes
// app.get('/', (req, res) => {
//     res.render('layouts/main.handlebars');
//   });

app.get("/posts/new", (req, res) => {
    const currentUser = req.user._id;
    res.render("posts-new", {
        currentUser
    })
});


//Controllers
require("./controllers/posts")(app);
require('./controllers/comments.js')(app);
require('./controllers/auth.js')(app);

// Start Server

app.listen(3000, () => {
    console.log('Reddit listening on port localhost:3000!');
});

module.exports = app;