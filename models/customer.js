//
// Creating our Customer model
//Set it as export because we will need it required on the server
module.exports = function(sequelize, DataTypes) {
  var Customer = sequelize.define("Customer", {
    // The email cannot be null, and must be a proper email before creation
    first_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    
  }); 

  
  return Customer;
};
