// Requiring path to so we can use relative routes to our HTML files
const datatable = require(`sequelize-datatable`);
const  db = require("../models");
const model = require('../models/customer');
const NodeTable = require("nodetable");
//
// Requiring our custom middleware for checking if a user is logged in
var isAuthenticated = require("../config/middleware/isAuthenticated");
//
module.exports = function(app) {
  //root url for site
  app.get("/customers", isAuthenticated, (req, res) => {
      let data = {
        layout: 'layouts/main'
      }
      res.render('customers/index',data)

  });

  // Datatable route to get the data
app.get("/customers/data", (req, res, next) => {
  console.log(req.body)
  datatable(model, req.query, {})
    .then((result) => {
      // result is response for datatables
      console.log(err);
      res.json(result);
    });

  // Get the query string paramters sent by Datatable
  //const requestQuery = req.query;

  /**
   * This is array of objects which maps 
   * the database columns with the Datatables columns
   * db - represents the exact name of the column in your table
   * dt - represents the order in which you want to display your fetched values
   * If your want any column to display in your datatable then
   * you have to put an enrty in the array , in the specified format
   * carefully setup this structure to avoid any errors
   */
  /**let columnsMap = [
    {
      db: "first_name",
      dt: 0
    },
    {
      db: "last_name",
      dt: 1
    },
    {
      db: "email",
      dt: 2
    },
    {
      db: "address",
      dt: 3
    }
  ];*/

  // our database table name
  // const tableName = "users"

  // Custome SQL query
  //const query = "SELECT * FROM customers"

  // NodeTable requires table's primary key to work properly
  /**const primaryKey = "id"
  
  const nodeTable = new NodeTable(requestQuery, db, query, primaryKey, columnsMap);
 
  nodeTable.output((err, data)=>{
    if (err) {
      console.log(err);
      return;
    }

    // Directly send this data as output to Datatable
    res.send(data)
  })*/
  
});


};