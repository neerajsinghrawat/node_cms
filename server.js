// Requiring necessary npm middleware packages 
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");

const flash = require('connect-flash');
//for custom layout 

const expressLayouts = require('express-ejs-layouts')

// Requiring passport as we've configured it
const passport = require("./config/passport");

// Setting up port
const PORT = process.env.PORT || 8080;

//Import the models folder
const db = require("./models");

// Creating express app and configuring middleware 
//needed to read through our public folder
const app = express();
app.use(bodyParser.urlencoded({ extended: false })); //For body parser
app.use(bodyParser.json());

//for layout and views
app.set('view engine','ejs')
app.set('views',__dirname + '/views')
app.set('layout','layouts/layout')
app.use(expressLayouts)
app.use(express.static("public"));

// We need to use sessions to keep track of our user's login status
app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
// Requiring our routes
require("./routes/users.js")(app);
require("./routes/categories.js")(app);
require("./routes/customers.js")(app);
require("./routes/products.js")(app);
//require("./routes/api-routes.js")(app);

//
//we are doing a GET to test if our server is working fine
app.get('/', function(req, res) {    
       res.send('Welcome to Passport with Sequelize and without HandleBars');
});

//
//this will listen to and show all activities on our terminal to 
//let us know what is happening in our app
// Syncing our database and logging a message to the user upon success
db.sequelize.sync().then(function() {
    app.listen(PORT, function() {
      console.log("==>Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
    });
  });