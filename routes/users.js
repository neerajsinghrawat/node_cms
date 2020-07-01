// Requiring path to so we can use relative routes to our HTML files
var path = require("path");
// Requiring our models and passport as we've configured it
var db = require("../models");
var passport = require("../config/passport");
//
// Requiring our custom middleware for checking if a user is logged in
var isAuthenticated = require("../config/middleware/isAuthenticated");
//
module.exports = function(app) {
  //root url for site
  app.get('/', (req, res) => {
       // If the user already has an account send them to the members page
      if (req.user) {
        res.redirect("/dashboard");
      }else{
        res.redirect("/login");
      }

  })

  //
  app.get("/login", (req, res) => {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/dashboard");
    }
    //res.sendFile(path.join(__dirname, "../public/login.html"));
    res.render('users/login',{message:req.flash('loginMessage')})
  });

  app.post("/login",passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
   }), (req, res) => {
    // Since we're doing a POST with javascript, we can't actually redirect that post into a GET request
    // So we're sending the user back the route to the members page because the redirect will happen on the front end
    // They won't get this or even be able to access this page if they aren't authed
    res.redirect("/dashboard");
  });

  //
  app.get("/signup", (req, res) => {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/dashboard");
    }
    //res.sendFile(path.join(__dirname, "../public/signup.html"));
    res.render('users/signup',{message:req.flash('signupMessage')})
  });

   // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/signup", (req, res) => {
    console.log(req.body);
    db.User.create({
      email: req.body.email,
      password: req.body.password
    }).then(function() {
      req.flash('loginMessage', 'Sucessfully Signup')
      res.redirect("/login");
    }).catch(function(err) {
      req.flash('signupMessage', err.errors[0].message)
      res.redirect("/signup");
      // res.status(422).json(err.errors[0].message);
    });
  });

//
  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be 
  //redirected to the signup page
  app.get("/dashboard", isAuthenticated, (req, res) => {
      //console.log(req)
      //,{ layout: 'layouts/main' }
      //res.sendFile(path.join(__dirname, "../public/members.html"));
      res.render('dashboard/index',{ layout: 'layouts/main',title : 'Dashboard',message:req.flash('loginMessage') })

  });

  // Route for logging user out
  app.get("/logout", function(req, res) {
    req.flash('signupMessage', 'Sucessfully Logout')
    
    req.logout();
    
    res.redirect("/");
  });
};