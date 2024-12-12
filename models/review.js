
let dbConnect = require("../dbConnect");

const { DataTypes, Model }  = require("./model");

class Review extends Model {}

let review = new Review();

review.init(
  {
    Comment: {
        type: DataTypes.LONGSTRING
      }
    }
);

module.exports = {
  Review: review,
  };

