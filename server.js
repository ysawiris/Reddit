// Require Libraries
const express = require('express');


// App Setup
const app = express();
require('./controllers/posts.js')(app);
// Middleware
const exphbs  = require('express-handlebars');

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

// Use Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Add after body parser initialization!
app.use(expressValidator());

// Set db
require('./data/reddit-db');

// Routes
app.get('/', (req, res) => {
    res.render('layouts/main.handlebars');
  });

app.get('/posts/new', (req, res) => {
    res.render('posts-new.handlebars')
})

// Start Server

app.listen(3000, () => {
  console.log('Reddit listening on port localhost:3000!');
});

