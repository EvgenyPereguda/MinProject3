
let dbConnect = require("../dbConnect");

const { DataTypes, Model }  = require("./model");

class DishPlace extends Model {}

let dishplace = new DishPlace();

dishplace.init(
  {
    }
);

module.exports = {
  DishPlace: dishplace,
  };
