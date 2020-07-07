// Creating our Product model
//Set it as export because we will need it required on the server

module.exports = function(sequelize, DataTypes) {


    var Product = sequelize.define('Product', {
          id:{
              allowNull: false,
              autoIncrement: true,
              primaryKey: true,
              type: DataTypes.INTEGER
          },
          name: DataTypes.STRING,
          slug: DataTypes.STRING,
          description: DataTypes.STRING,
          image: DataTypes.STRING,
          category_id: {
              allowNull: true,
              type: DataTypes.INTEGER
          }
        });

    Category  = sequelize.define('Category', {id:{
              allowNull: false,
              autoIncrement: true,
              primaryKey: true,
              type: DataTypes.INTEGER
          },
          name: DataTypes.STRING,});

    Product.belongsTo(Category, {foreignKey: 'category_id'}); 


   console.log(Category);

    return Product;
  
  };