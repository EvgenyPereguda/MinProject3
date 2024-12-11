
let dbConnect = require("../dbConnect");

const { DataTypes, Model }  = require("./model");

class Customer extends Model {}

let customer = new Customer();

customer.init(
    {
        FirstName: {
          type: DataTypes.STRING,
          allowNull: false
        },
        LastName: {
          type: DataTypes.STRING,
          allowNull: false
        },
        Email: {
          type: DataTypes.STRING,
          allowNull: false
        }
      }
);


module.exports = {
    Customer: customer,
  };