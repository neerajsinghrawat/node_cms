// Requiring path to so we can use relative routes to our HTML files
const datatable = require(`sequelize-datatable`);
const  db = require("../models");
//
// Requiring our custom middleware for checking if a user is logged in
var isAuthenticated = require("../config/middleware/isAuthenticated");
//

//for upload file/image
const multer = require('multer');
const path = require('path');

module.exports = function(app) {

  const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
  
    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
  
  const upload = multer({ storage: storage});
 
  //root url for site
 
  app.get("/categories", isAuthenticated, (req, res, next) => {

    let limit = 3   // number of records per page
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


  app.get("/category/add", isAuthenticated, (req, res, next) => {
          
          res.render('categories/add', {
                layout: 'layouts/main',title : 'Add Category'
          });

  }); 

  app.post("/category/add", upload.single('image'), (req, res, next) => {
      /*var fileInfo = req.file
      res.send(fileInfo)*/

      var filename = req.file.filename
   
      return db.Category.create({
        name: req.body.name,
        image: filename,
        slug: req.body.slug,
        description: req.body.description

      }).then(function (categories) {
          if (categories) {
            req.flash('sucessMessage', 'Sucessfully added')
            res.redirect("/categories");
          } else {
            req.flash('errorMessage', 'Sucessfully added')
            res.redirect("/categories");
          }
      });
    
  }); 




  


};