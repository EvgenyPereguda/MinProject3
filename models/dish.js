
let dbConnect = require("../dbConnect");

const { DataTypes, Model }  = require("./model");

class Dish extends Model {}

let dish = new Dish();

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

