// Requiring path to so we can use relative routes to our HTML files
const datatable = require(`sequelize-datatable`);
const  db = require("../models");
// Requiring our custom middleware for checking if a user is logged in
var isAuthenticated = require("../config/middleware/isAuthenticated");
var multer = require('multer');
var Storage = multer.diskStorage({
      

   destination: function(req, file, callback) {
    //console.log(file);
       callback(null, "./public/images");
   },
   filename: function(req, file, callback) {
    //console.log(file);
       callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
   }
});
     var upload = multer({
    

      storage: Storage
      //console.log(storage);
      }).single("image");
//

//
module.exports = function(app) {
  //root url for site
 
  app.get("/categories", isAuthenticated, (req, res, next) => {

    let limit = 10   // number of records per page
    let offset = 0
    db.Category.findAndCountAll()
    .then((data) => {
      console.log(req.query);
      let page = req.query.page || 1      // page number
      console.log(page);
      let pages = Math.ceil(data.count / limit)
      let pageStart = page
      let lastPage = 10 + pageStart
      offset = limit * (page - 1);
      db.Category.findAll({
        limit: limit,
        offset: offset,
        order: [['name', 'DESC']]
      })
      .then((categories) => {
          res.render('categories/index', {
                  layout: 'layouts/main',
                  pageStart: pageStart,
                  lastPage : lastPage,
                  pages : pages,
                  currentPage : page,
                  categories: categories,
                  title : 'Category'
          });
      });
    })
    .catch(function (error) {
      res.status(500).send('Internal Server Error');
    });

  }); 
  
  app.get("/category/add", isAuthenticated,(req, res) => {


    let limit = 1   // number of records per page
    let offset = 0
    db.Category.findAndCountAll()
    .then((data) => {
      console.log(req.query);
      let page = req.query.page || 1      // page number
      console.log(page);
      let pages = Math.ceil(data.count / limit)
      let pageStart = page
      let lastPage = 10 + pageStart
      offset = limit * (page - 1);
      db.Category.findAll({
        limit: limit,
        offset: offset,
        order: [['name', 'DESC']]
      })
      .then((categories) => {
          res.render('categories/add', {
                  layout: 'layouts/main',
                  pageStart: pageStart,
                  lastPage : lastPage,
                  pages : pages,
                  currentPage : page,
                  categories: categories,
                  title : 'Category'
          });
      });
    })
    .catch(function (error) {
      res.status(500).send('Internal Server Error');
    });

  });  
  app.post("/category/save", isAuthenticated,(req, res) => {

    console.log(req.body); 

      upload(req, res, function(err) {
        console.log(err);
       if (err) {
          req.flash('loginMessage', "Something went wrong!");
       }
      
      req.flash('loginMessage',"File uploaded sucessfully!.");
          db.Category.create({
            name: req.body.name,
            slug: req.body.slug,
            description: req.body.description,
            image: req.file.filename,
          }).then(function() {
            req.flash('loginMessage', 'Sucessfully add')
            res.redirect("/categories");
          }).catch(function(err) {
            req.flash('signupMessage', err.errors[0].message)
            res.redirect("/category/add");
            // res.status(422).json(err.errors[0].message);
          });
     });
    




  });
  app.get("/category/edit/:id", isAuthenticated,(req, res) => {

    let limit = 1   // number of records per page
    let offset = 0
    db.Category.findOne({where: {id:req.params.id}})
      .then((categories) => {
        console.log(categories);
          res.render('categories/edit', {
                  layout: 'layouts/main',
                  categories: categories,
                  title : 'Category'
          });
      })   
    .catch(function (error) {
      res.status(500).send('Internal Server Error');
    });

  });  

  app.post("/category/update/:id",isAuthenticated, (req, res) => {

    upload(req, res, function(err) {
       // console.log(err);
       if (err) {
          req.flash('loginMessage', "Something went wrong!");
       }    
           console.log(req.body); 
    db.Category.update({
            name: req.body.name,
            slug: req.body.slug,
            description: req.body.description,          
            image: req.file.filename           
          },{
       where:  { id:req.params.id }
       
    }).then(function() {
            req.flash('loginMessage', 'Sucessfully update')
            res.redirect("/categories");
          }).catch(function(err) {
            req.flash('signupMessage', err.errors[0].message)
            res.redirect("/category/edit/");
            // res.status(422).json(err.errors[0].message);
          });
          });
   

  });

  app.get("/category/delete/:id", isAuthenticated,(req, res) => {

    var id = req.params.id;
    db.Category.destroy({
       where: {
          id: id //this will be your id that you want to delete
       }
    })
    .then(function() {
            req.flash('loginMessage', 'Sucessfully delete')
            res.redirect("/categories");
          }).catch(function(err) {
            req.flash('signupMessage', err.errors[0].message)
            res.redirect("/categories");
            // res.status(422).json(err.errors[0].message);
          });

  });
  


};