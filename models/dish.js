
let dbConnect = require("../dbConnect");

const { DataTypes, Model }  = require("./model");

class Dish extends Model {}

let dish = new Dish();

dish.modelInit = 'Image VARCHAR(50) NOT NULL, Name VARCHAR(50) NOT NULL, Description VARCHAR(50) NOT NULL, Price DECIMAL NOT NULL';


dish.init(
  {
      Image: {
        type: DataTypes.STRING,
        allowNull: false
      },
      Name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      Description: {
        type: DataTypes.STRING,
        allowNull: false
      },
      Price: {
        type: DataTypes.DECIMAL,
        allowNull: false
      }
    }
);

module.exports = {
  Dish: dish,
  };

