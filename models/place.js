
let dbConnect = require("../dbConnect");

const { DataTypes, Model }  = require("./model");

class Place extends Model {}

let place = new Place();

place.init(
  {
      Number: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    }
);

module.exports = {
  Place: place,
  };