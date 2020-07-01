//
// Creating our Category model
//Set it as export because we will need it required on the server
module.exports = function(sequelize, DataTypes) {

    var Category = sequelize.define('Category', {
          id:{
              allowNull: false,
              autoIncrement: true,
              primaryKey: true,
              type: DataTypes.INTEGER
          },
          name: DataTypes.STRING,
          slug: DataTypes.STRING,
          description: DataTypes.STRING,
          parent_id: {
              allowNull: true,
              type: DataTypes.INTEGER
          }
        });
  
    return Category;
  
  };